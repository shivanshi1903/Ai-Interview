import os
import re
import json
import time
import hmac
import hashlib
import secrets
import tempfile
import concurrent.futures
from pathlib import Path
from typing import Optional

import pdfplumber
from groq import Groq

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()

# ── AI client setup ───────────────────────────────────────────────────────────
# Groq powers BOTH modes: the structured 5-question flow and the
# free-flowing conversational chat interview.
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# Override with GROQ_MODEL in .env if you want to swap models without touching code.
# openai/gpt-oss-120b is Groq's recommended general-purpose model (successor to the
# now-deprecated llama-3.3-70b-versatile). Other good options: openai/gpt-oss-20b
# (faster/cheaper) or llama-3.1-8b-instant (fastest, lighter-weight tasks).
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
groq_client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session store (shared by both modes) ────────────────────────────
sessions: dict[str, dict] = {}

# ── Simple file-based user store (signup / login) ─────────────────────────────
USERS_FILE = Path(__file__).parent / "users.json"


def load_users() -> dict:
    if not USERS_FILE.exists():
        return {}
    try:
        return json.loads(USERS_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        return {}


def save_users(users: dict) -> None:
    USERS_FILE.write_text(json.dumps(users, indent=2))


def hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000).hex()


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

COMMON_SKILLS = [
    "python", "java", "javascript", "typescript", "react", "node.js", "express",
    "fastapi", "django", "flask", "html", "css", "sql", "mysql", "postgresql",
    "mongodb", "git", "github", "docker", "kubernetes", "aws", "azure", "gcp",
    "machine learning", "deep learning", "data analysis", "pandas", "numpy",
    "scikit-learn", "tensorflow", "pytorch", "nlp", "rest api", "graphql",
    "linux", "power bi", "tableau", "excel", "communication", "leadership",
    "problem solving", "teamwork", "project management",
]


# ══════════════════════════════════════════════════════════════════════════
# INTERVIEWER PERSONALITY & DIFFICULTY (feature: personality/difficulty select)
# ══════════════════════════════════════════════════════════════════════════

PERSONALITY_STYLES = {
    "friendly": (
        "Adopt a warm, encouraging, supportive and conversational tone. Reassure the candidate, "
        "reduce interview anxiety, and celebrate what they get right, while still assessing their "
        "skills honestly."
    ),
    "professional": (
        "Adopt a formal, neutral, corporate interview tone. Be polite, businesslike and structured, "
        "similar to a real company technical interviewer."
    ),
    "strict": (
        "Adopt a serious, challenging and concise tone. Ask precise follow-up questions, push the "
        "candidate to justify their answers, and expect exact, well-reasoned responses. Do not over-praise."
    ),
    "adaptive": (
        "Adopt a tone that dynamically adjusts based on the candidate's previous answers and confidence: "
        "be more encouraging and supportive when they struggle, and more challenging and probing when "
        "they perform well."
    ),
    "beginner": (
        "Adopt a patient, explanatory, slower-paced tone. Give the candidate room to think, ask simpler "
        "follow-up questions, and briefly clarify concepts if the candidate seems confused."
    ),
}
DEFAULT_PERSONALITY = "professional"

DIFFICULTY_STYLES = {
    "easy": (
        "Keep technical complexity low. Ask foundational questions, expect brief explanations, use at "
        "most one follow-up question per topic, and favor simple, common, everyday scenarios."
    ),
    "medium": (
        "Use moderate technical complexity. Expect solid explanations with examples, use up to two "
        "follow-up questions per topic, and include moderately complex scenarios."
    ),
    "hard": (
        "Use high technical complexity. Expect deep, precise explanations, use multiple follow-up "
        "questions, and include complex, edge-case-driven scenarios such as system design, optimization "
        "and trade-off discussions."
    ),
}
DEFAULT_DIFFICULTY = "medium"

# Questions are generated in batches of 5. The interview runs for up to
# MAX_QUESTION_BATCHES batches (i.e. MAX_QUESTION_BATCHES * 5 questions total)
# unless the candidate ends it earlier via "Get Evaluation Score".
QUESTIONS_PER_BATCH = 5
MAX_QUESTION_BATCHES = 3
MAX_QUESTIONS = QUESTIONS_PER_BATCH * MAX_QUESTION_BATCHES


# ══════════════════════════════════════════════════════════════════════════
# SHARED HELPERS (resume parsing, skill extraction — used by both modes)
# ══════════════════════════════════════════════════════════════════════════

def extract_text_from_pdf(path: str) -> str:
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text.strip()


def extract_skills_locally(resume_text: str) -> list[str]:
    text = resume_text.lower()
    found = []
    for skill in COMMON_SKILLS:
        pattern = r"(?<![a-z0-9+#.])" + re.escape(skill.lower()) + r"(?![a-z0-9+#.])"
        if re.search(pattern, text):
            found.append(skill.title() if skill != "node.js" else "Node.js")

    if found:
        return found[:12]

    words = re.findall(r"\b[A-Za-z][A-Za-z+#.]{2,}\b", resume_text)
    ignored = {
        "the", "and", "for", "with", "from", "this", "that", "resume", "email",
        "phone", "experience", "education", "project", "summary", "objective",
    }
    candidates = []
    for word in words:
        lower = word.lower()
        if lower not in ignored and lower not in [s.lower() for s in candidates]:
            candidates.append(word)
    return candidates[:8] or ["Communication", "Problem Solving"]


def extract_name_locally(resume_text: str) -> str:
    for line in resume_text.splitlines():
        line = line.strip()
        if 2 <= len(line.split()) <= 4 and line.replace(" ", "").isalpha():
            return line.title()
    return "Candidate"


# ══════════════════════════════════════════════════════════════════════════
# MODE 1 — GROQ (main engine): structured 5-question interview
# ══════════════════════════════════════════════════════════════════════════

def get_groq_text(prompt: str, action: str) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(500, "GROQ_API_KEY is missing. Add it to your .env file and restart the backend.")
    last_message = ""
    delays = [3, 8, 15]  # up to 3 retries with increasing backoff on rate-limit errors
    for attempt in range(len(delays) + 1):
        try:
            resp = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception as exc:
            message = str(exc)
            last_message = message
            # Always log the real error server-side — this is the fastest way
            # to tell "quota exceeded" apart from "bad API key" apart from
            # "model not found", which all otherwise look identical to the UI.
            print(f"[Groq error] action='{action}' attempt={attempt + 1}: {message}")
            is_rate_limit = "429" in message or "quota" in message.lower() or "rate_limit" in message.lower() or "rate limit" in message.lower()
            if is_rate_limit and attempt < len(delays):
                time.sleep(delays[attempt])
                continue
            if is_rate_limit:
                raise HTTPException(
                    429,
                    f"Groq quota/rate limit hit while trying to {action}. Using local fallback. "
                    f"Underlying error: {message[:200]}",
                )
            raise HTTPException(502, f"AI service failed while trying to {action}: {message[:300]}")
    raise HTTPException(
        429,
        f"Groq quota/rate limit hit while trying to {action}. Using local fallback. "
        f"Underlying error: {last_message[:200]}",
    )


def parse_model_json(raw: str, error_message: str):
    cleaned = (raw or "").strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    if not cleaned:
        raise HTTPException(502, error_message)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(502, error_message)


def is_quota_error(exc: HTTPException) -> bool:
    return getattr(exc, "status_code", None) == 429


def generate_question_locally(skills: list[str], question_number: int) -> str:
    if skills:
        primary = skills[(question_number - 1) % len(skills)]
    else:
        primary = "your strongest technical skill"
    templates = [
        f"Can you explain one project where you used {primary} and what problem it solved?",
        f"What are the most important concepts a beginner should understand in {primary}?",
        f"Describe a challenging bug or issue you faced while working with {primary}. How did you fix it?",
        f"How would you compare {primary} with another tool or technology you have used?",
        f"What best practices do you follow when working with {primary}?",
    ]
    return templates[(question_number - 1) % len(templates)]


def evaluate_answer_locally(answer: str) -> dict:
    words = re.findall(r"\w+", answer.lower())
    unique_words = len(set(words))
    length_score = min(1.0, len(words) / 80)
    detail_score = min(1.0, unique_words / 45)
    has_example = any(word in answer.lower() for word in ["example", "project", "built", "implemented", "used", "because"])
    example_score = 1.0 if has_example else 0.55
    avg = (length_score + detail_score + example_score) / 3
    bounded = max(0.1, min(0.95, avg))
    sentence_count = max(1, len(re.findall(r"[.!?]+", answer)))
    avg_sentence_len = len(words) / sentence_count
    fluency_score = max(0.1, min(0.95, 1 - abs(avg_sentence_len - 14) / 30))
    professionalism_score = max(0.1, min(0.95, 0.55 + (0.2 if has_example else 0) + (0.15 if len(words) > 20 else 0)))

    # Build real, answer-specific feedback from the same signals used for
    # scoring above, so the local fallback is actually useful instead of a
    # generic placeholder when the Groq API is temporarily unavailable.
    strengths, weaknesses, suggestions, feedback_bits = [], [], [], []

    if len(words) < 15:
        weaknesses.append("Answer was quite short")
        suggestions.append("Expand your answer — aim for a few complete sentences with specific details.")
        feedback_bits.append("Your answer was brief, so it's hard to judge depth of understanding.")
    elif len(words) > 200:
        weaknesses.append("Answer may be longer than necessary")
        suggestions.append("Try to be more concise and focus on the most relevant points.")
        feedback_bits.append("Your answer was detailed, but could be tightened for clarity.")
    else:
        strengths.append("Good answer length and level of detail")
        feedback_bits.append("Your answer had a reasonable length and level of detail.")

    if has_example:
        strengths.append("Backed the answer with a concrete example or project")
        feedback_bits.append("Nice touch citing a specific example or project.")
    else:
        weaknesses.append("No concrete example or project mentioned")
        suggestions.append("Support your explanation with a specific example, project, or real scenario.")

    if unique_words < 20:
        weaknesses.append("Limited technical vocabulary used")
        suggestions.append("Use more precise technical terms relevant to the question.")
    else:
        strengths.append("Used a good range of relevant vocabulary")

    feedback = " ".join(feedback_bits) or "Answer evaluated using local heuristics."
    feedback += (
        " (Automated local evaluation — the Groq AI evaluator was temporarily unavailable, "
        "so this feedback is generated from answer length, vocabulary, and examples rather than full AI analysis.)"
    )

    return {
        "technical_accuracy": round(bounded, 2),
        "relevance": round(max(0.1, min(0.95, length_score + 0.2)), 2),
        "depth": round(max(0.1, min(0.95, detail_score)), 2),
        "communication": round(max(0.1, min(0.95, (length_score + fluency_score) / 2)), 2),
        "confidence": round(max(0.1, min(0.95, example_score * 0.7 + length_score * 0.3)), 2),
        "grammar": round(max(0.3, min(0.95, 0.85 - (0 if sentence_count > 1 else 0.15))), 2),
        "fluency": round(fluency_score, 2),
        "professionalism": round(professionalism_score, 2),
        "feedback": feedback,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "missing_concepts": [],
        "suggested_improvements": suggestions,
        "follow_up_question": "",
    }


def extract_skills(resume_text: str) -> list[str]:
    prompt = (
        "Extract a concise list of technical and professional skills from the resume below. "
        "Return ONLY a JSON array of skill strings, nothing else.\n\nResume:\n" + resume_text
    )
    try:
        raw = get_groq_text(prompt, "extract skills")
        skills = parse_model_json(raw, "AI could not extract skills from this resume. Please try again.")
    except HTTPException as exc:
        if is_quota_error(exc):
            return extract_skills_locally(resume_text)
        raise
    return skills if isinstance(skills, list) else []


def generate_question(skills: list[str], previous_qa: list[dict], question_number: int) -> str:
    history = "\n".join(
        [f"Q{i+1}: {qa['question']}\nA{i+1}: {qa['answer']}" for i, qa in enumerate(previous_qa)]
    )
    prompt = (
        f"You are a professional technical interviewer. The candidate has the following skills: {', '.join(skills)}.\n"
        f"This is question {question_number} of 5.\n"
        f"Previous Q&A:\n{history}\n\n"
        "Generate ONE concise, relevant technical interview question. "
        "Return ONLY the question text, nothing else."
    )
    try:
        return get_groq_text(prompt, "generate a question")
    except HTTPException as exc:
        if is_quota_error(exc):
            return generate_question_locally(skills, question_number)
        raise


def evaluate_answer(question: str, answer: str, skills: list[str]) -> dict:
    prompt = (
        f"You are evaluating a technical interview answer.\n"
        f"Question: {question}\n"
        f"Candidate skills: {', '.join(skills)}\n"
        f"Answer: {answer}\n\n"
        "Rate this answer on a scale of 0.0 to 1.0 for:\n"
        "1. technical_accuracy\n2. relevance\n3. depth\n\n"
        "Return ONLY a JSON object like: {\"technical_accuracy\": 0.8, \"relevance\": 0.9, \"depth\": 0.7}"
    )
    try:
        raw = get_groq_text(prompt, "evaluate the answer")
        return parse_model_json(raw, "AI could not evaluate the answer. Please try again.")
    except HTTPException as exc:
        if is_quota_error(exc):
            return evaluate_answer_locally(answer)
        raise


def generate_question_batch_locally(skills: list[str], batch_number: int) -> list[str]:
    """Local fallback: produce QUESTIONS_PER_BATCH template questions when Groq is unavailable."""
    start = (batch_number - 1) * QUESTIONS_PER_BATCH
    return [generate_question_locally(skills, start + i + 1) for i in range(QUESTIONS_PER_BATCH)]


def generate_question_batch(session: dict, batch_number: int) -> list[str]:
    """
    Generates the next QUESTIONS_PER_BATCH interview questions with Groq.
    Batch 1 is generated from the resume + skills + personality + difficulty.
    Later batches additionally include previous Q&A, scores, strengths and
    weaknesses so the interview adapts to the candidate's actual performance.
    """
    skills = session["skills"]
    resume_text = session.get("resume_text", "")
    personality = session.get("personality") or DEFAULT_PERSONALITY
    difficulty = session.get("difficulty") or DEFAULT_DIFFICULTY
    personality_style = PERSONALITY_STYLES.get(personality, PERSONALITY_STYLES[DEFAULT_PERSONALITY])
    difficulty_style = DIFFICULTY_STYLES.get(difficulty, DIFFICULTY_STYLES[DEFAULT_DIFFICULTY])

    if batch_number == 1:
        prompt = (
            "You are an AI technical interviewer conducting a job interview.\n"
            f"Interviewer personality: {personality}. {personality_style}\n"
            f"Interview difficulty: {difficulty}. {difficulty_style}\n\n"
            f"Candidate skills (numbered): {', '.join(f'{i+1}. {s}' for i, s in enumerate(skills)) if skills else 'not specified'}\n"
            f"Resume excerpt:\n{resume_text[:3000]}\n\n"
            f"Generate the first {QUESTIONS_PER_BATCH} interview questions for this candidate, tailored to "
            "their resume, skills, the chosen personality and the chosen difficulty.\n"
            "IMPORTANT — skill coverage rules:\n"
            f"- Spread the {QUESTIONS_PER_BATCH} questions across DIFFERENT skills from the candidate's skill "
            "list above — do not ask more than one question about the same skill unless the skill list has "
            f"fewer than {QUESTIONS_PER_BATCH} distinct skills.\n"
            "- Prioritize the candidate's strongest / most prominent skills first, then fill remaining "
            "questions with other listed skills.\n"
            "- Each question must be clearly about a different topic/skill than the others in this batch — "
            "no two questions should test the same concept.\n"
            "- Word each question in a way that matches the interviewer personality described above.\n\n"
            f"Return ONLY a JSON array of {QUESTIONS_PER_BATCH} question strings, nothing else."
        )
    else:
        qa_so_far = session.get("qa", [])
        history_lines = []
        strengths_all: list[str] = []
        weaknesses_all: list[str] = []
        for item in qa_so_far:
            ev = item.get("evaluation") or {}
            history_lines.append(
                f"Q: {item['question']}\nA: {item.get('answer') or '(no answer)'}\n"
                f"Overall score: {ev.get('overall_score', 'n/a')}"
            )
            strengths_all.extend(ev.get("strengths", []) or [])
            weaknesses_all.extend(ev.get("weaknesses", []) or [])

        prompt = (
            "You are an AI technical interviewer continuing a live job interview.\n"
            f"Interviewer personality: {personality}. {personality_style}\n"
            f"Interview difficulty: {difficulty}. {difficulty_style}\n\n"
            f"Candidate skills (numbered): {', '.join(f'{i+1}. {s}' for i, s in enumerate(skills)) if skills else 'not specified'}\n\n"
            f"Questions already asked (do not repeat these or ask near-duplicates):\n"
            f"{chr(10).join('- ' + item['question'] for item in qa_so_far)}\n\n"
            f"Previous questions, answers and scores:\n{chr(10).join(history_lines)}\n\n"
            f"Candidate strengths observed so far: {', '.join(strengths_all) if strengths_all else 'none noted'}\n"
            f"Candidate weaknesses observed so far: {', '.join(weaknesses_all) if weaknesses_all else 'none noted'}\n\n"
            f"Generate the next {QUESTIONS_PER_BATCH} interview questions that naturally continue this "
            "interview.\n"
            "IMPORTANT — skill coverage rules:\n"
            "- Spread these questions across skills that have been covered LESS so far, so that over the "
            "full interview the candidate is tested on as many of their different listed skills as "
            "possible, instead of the same one or two skills repeatedly.\n"
            f"- No two questions in this batch of {QUESTIONS_PER_BATCH} should test the same skill/concept.\n"
            "- Do not repeat or closely rephrase any question already asked.\n"
            "- Use the candidate's actual performance to adapt: give deeper, more challenging questions on "
            "skills where they performed well; give more foundational questions, or explore related "
            "concepts instead of repeating identical questions, on skills where they struggled.\n"
            "- Word each question in a way that matches the interviewer personality described above.\n\n"
            f"Return ONLY a JSON array of {QUESTIONS_PER_BATCH} question strings, nothing else."
        )

    try:
        raw = get_groq_text(prompt, "generate the next batch of interview questions")
        parsed = parse_model_json(raw, "AI could not generate the next batch of questions. Please try again.")
    except HTTPException as exc:
        if is_quota_error(exc):
            return generate_question_batch_locally(skills, batch_number)
        raise

    if isinstance(parsed, list) and parsed:
        questions = [str(q).strip() for q in parsed if str(q).strip()]
        if questions:
            return questions[:QUESTIONS_PER_BATCH]
    return generate_question_batch_locally(skills, batch_number)


def evaluate_answer_full(question: str, answer: str, skills: list[str], personality: Optional[str], difficulty: Optional[str], resume_text: str = "", previous_qa: Optional[list] = None) -> dict:
    """
    Rich, senior-interviewer-style evaluation of a single answer, generated
    ENTIRELY by Groq — there is intentionally no local heuristic fallback
    here. If Groq is unavailable, this returns a small marker dict
    ({"evaluation_failed": True, ...}) instead of fabricating a score, so the
    frontend can show an honest "evaluation unavailable, retrying" state
    rather than fake feedback.
    """
    personality = personality or DEFAULT_PERSONALITY
    difficulty = difficulty or DEFAULT_DIFFICULTY
    personality_style = PERSONALITY_STYLES.get(personality, PERSONALITY_STYLES[DEFAULT_PERSONALITY])
    difficulty_style = DIFFICULTY_STYLES.get(difficulty, DIFFICULTY_STYLES[DEFAULT_DIFFICULTY])

    context_lines = []
    for item in (previous_qa or [])[-4:]:
        if item.get("question") == question:
            continue
        ev = item.get("evaluation") or {}
        context_lines.append(f"- Q: {item.get('question')} | Candidate answered and scored ~{round((ev.get('overall_score') or 0) * 100)}%")

    prompt = (
        "You are a Senior Technical Interviewer with 15+ years of experience interviewing candidates "
        "at top technology companies. You are honest, detailed, and actionable — you never hide mistakes "
        "and you never give generic feedback. Every judgment must be grounded in what the candidate "
        "actually wrote.\n\n"
        f"Interviewer personality for this session: {personality}. {personality_style}\n"
        f"Interview difficulty: {difficulty}. {difficulty_style}\n"
        f"Candidate's resume/skills context: {resume_text[:1200] if resume_text else ', '.join(skills) if skills else 'not specified'}\n"
        + (f"Recent interview context:\n{chr(10).join(context_lines)}\n" if context_lines else "")
        + f"\nQuestion asked: {question}\n"
        f"Candidate's answer (verbatim transcript): {answer or '(no answer given)'}\n\n"
        "Evaluate this answer independently and return ONLY a JSON object in exactly this shape "
        "(no markdown, no commentary outside the JSON):\n"
        "{\n"
        '  "correctness": "correct" | "partially_correct" | "incorrect",\n'
        '  "technical_accuracy_10": 0-10,\n'
        '  "confidence_level": {"label": "Very Confident" | "Moderately Confident" | "Low Confidence", "score_10": 0-10},\n'
        '  "completeness": "complete" | "mostly_complete" | "incomplete",\n'
        '  "communication_score_10": 0-10,\n'
        '  "positive_feedback": "specific sentence(s) on what the candidate did well",\n'
        '  "mistakes": [{"mistake": "what they said", "why_wrong": "why it is incorrect, be specific"}],\n'
        '  "missing_concepts": ["concept the candidate should have mentioned"],\n'
        '  "study_recommendations": [{"topic": "short topic name", "why": "why this matters for this candidate"}],\n'
        '  "better_answer_example": "a stronger model answer to this exact question",\n'
        '  "difficulty_assessment": "easy" | "medium" | "hard",\n'
        '  "strength_meters": {"technical_understanding": 0-100, "communication": 0-100, "confidence": 0-100, "completeness": 0-100},\n'
        '  "follow_up_question": "a natural follow-up question, or empty string if none needed"\n'
        "}\n"
        "If the candidate gave no answer, still fill in every field honestly (correctness=incorrect, "
        "scores near 0, and explain what was missing)."
    )

    try:
        raw = get_groq_text(prompt, "evaluate the answer")
        data = parse_model_json(raw, "AI could not evaluate the answer.")
        if not isinstance(data, dict):
            raise HTTPException(502, "AI returned an unexpected evaluation format.")
    except HTTPException as exc:
        return {"evaluation_failed": True, "error_reason": str(exc.detail)[:300]}

    # Normalize/backfill so downstream aggregation never crashes on a missing key.
    data.setdefault("correctness", "partially_correct")
    data.setdefault("technical_accuracy_10", 5)
    data.setdefault("confidence_level", {"label": "Moderately Confident", "score_10": 5})
    data.setdefault("completeness", "mostly_complete")
    data.setdefault("communication_score_10", 5)
    data.setdefault("positive_feedback", "")
    data.setdefault("mistakes", [])
    data.setdefault("missing_concepts", [])
    data.setdefault("study_recommendations", [])
    data.setdefault("better_answer_example", "")
    data.setdefault("difficulty_assessment", difficulty)
    data.setdefault("strength_meters", {"technical_understanding": 50, "communication": 50, "confidence": 50, "completeness": 50})
    data.setdefault("follow_up_question", "")

    tech10 = float(data.get("technical_accuracy_10") or 0)
    comm10 = float(data.get("communication_score_10") or 0)
    conf10 = float((data.get("confidence_level") or {}).get("score_10") or 0)
    completeness_map = {"complete": 10, "mostly_complete": 6.5, "incomplete": 2}
    completeness10 = completeness_map.get(data.get("completeness"), 5)
    data["overall_score"] = round(((tech10 + comm10 + conf10 + completeness10) / 4) / 10, 3)
    data["evaluation_failed"] = False
    return data


def generate_overall_summary(session: dict, detailed_feedback: list[dict]) -> dict:
    """
    ONE dedicated Groq call over the full interview transcript that produces
    the executive-level summary: verdict, strengths/weak areas, knowledge gap
    analysis, a week-by-week learning roadmap, priority-ranked topics,
    company-readiness estimates, communication/behavioral analysis, AI
    suggestions and closing motivational feedback. No local fallback — on
    failure this returns a marker dict so the UI can show a retry state.
    """
    skills = session.get("skills", [])
    personality = session.get("personality") or DEFAULT_PERSONALITY
    difficulty = session.get("difficulty") or DEFAULT_DIFFICULTY

    lines = []
    for i, f in enumerate(detailed_feedback):
        if f.get("evaluation_available") is False:
            continue
        lines.append(
            f"Q{i+1}: {f['question']}\n"
            f"Answer: {(f.get('answer') or '')[:400]}\n"
            f"Correctness: {f.get('correctness')} | Technical: {f.get('technical_accuracy_10')}/10 | "
            f"Communication: {f.get('communication_score_10')}/10\n"
            f"Mistakes: {'; '.join(m.get('mistake','') for m in (f.get('mistakes') or [])) or 'none'}\n"
            f"Missing concepts: {', '.join(f.get('missing_concepts') or []) or 'none'}"
        )

    prompt = (
        "You are a Senior Technical Interviewer with 15+ years of experience. You have just finished "
        "conducting a full technical interview. Review the ENTIRE transcript below and produce an honest, "
        "detailed, personalized executive summary of the candidate's performance — like a real interview "
        "debrief, not generic praise.\n\n"
        f"Candidate's target skills: {', '.join(skills) if skills else 'not specified'}\n"
        f"Interview difficulty: {difficulty}. Interviewer personality used: {personality}.\n\n"
        f"Full interview transcript and per-question evaluation:\n{chr(10).join(lines)}\n\n"
        "Return ONLY a JSON object in exactly this shape (no markdown, no commentary outside the JSON):\n"
        "{\n"
        '  "overall_score_100": 0-100,\n'
        '  "verdict": "Excellent Candidate" | "Strong Candidate" | "Average Candidate" | "Needs Improvement" | "Not Ready Yet",\n'
        '  "strengths": ["specific strength demonstrated in this interview"],\n'
        '  "weak_areas": ["specific recurring weakness"],\n'
        '  "knowledge_gap_analysis": {"summary": "1-2 sentence overview", "gaps": ["recurring gap topic"]},\n'
        '  "learning_roadmap": [{"week": 1, "focus": "theme for the week", "topics": ["topic 1", "topic 2"]}],\n'
        '  "recommended_topics": [{"topic": "name", "priority": "Highest" | "High" | "Medium" | "Low"}],\n'
        '  "interview_readiness": [{"company": "Google", "percent": 0-100}, {"company": "Amazon", "percent": 0-100}, '
        '{"company": "Microsoft", "percent": 0-100}, {"company": "Startup Interviews", "percent": 0-100}],\n'
        '  "communication_analysis": {"grammar": 0-10, "professionalism": 0-10, "vocabulary": 0-10, '
        '"speaking_style": 0-10, "explanation_quality": 0-10, "logical_thinking": 0-10, "answer_structure": 0-10, '
        '"fluency": 0-10, "confidence": 0-10, "conciseness": 0-10},\n'
        '  "behavioral_analysis": {"confidence": 0-10, "stress_handling": 0-10, "consistency": 0-10, '
        '"critical_thinking": 0-10, "problem_solving": 0-10, "decision_making": 0-10, "professional_attitude": 0-10, '
        '"adaptability": 0-10},\n'
        '  "ai_suggestions": ["short, highly specific, actionable suggestion"],\n'
        '  "job_recommendations": [{"role": "job title that fits this candidate\'s demonstrated skills", '
        '"why_fit": "1 sentence on why this role matches", "skills_to_learn": ["skill to become more competitive"]}],\n'
        '  "motivational_feedback": "2-4 sentence honest, encouraging closing note"\n'
        "}\n"
        "The learning_roadmap should have 3-5 weeks, customized to this candidate's actual weak areas — "
        "not a generic CS curriculum. interview_readiness percentages are estimates, not guarantees, and "
        "should reflect how this candidate's specific answers would likely fare at each type of company. "
        "job_recommendations should list 2-4 real job roles genuinely supported by what the candidate "
        "demonstrated in THIS interview, not a generic list."
    )

    try:
        raw = get_groq_text(prompt, "generate the overall interview summary")
        data = parse_model_json(raw, "AI could not generate the overall interview summary.")
        if not isinstance(data, dict):
            raise HTTPException(502, "AI returned an unexpected summary format.")
    except HTTPException as exc:
        return {"summary_failed": True, "error_reason": str(exc.detail)[:300]}

    data.setdefault("overall_score_100", 0)
    data.setdefault("verdict", "Average Candidate")
    data.setdefault("strengths", [])
    data.setdefault("weak_areas", [])
    data.setdefault("knowledge_gap_analysis", {"summary": "", "gaps": []})
    data.setdefault("learning_roadmap", [])
    data.setdefault("recommended_topics", [])
    data.setdefault("interview_readiness", [])
    data.setdefault("communication_analysis", {})
    data.setdefault("behavioral_analysis", {})
    data.setdefault("ai_suggestions", [])
    data.setdefault("job_recommendations", [])
    data.setdefault("motivational_feedback", "")
    data["summary_failed"] = False
    return data


def cosine_similarity_score(answer: str) -> float:
    """Checks if answer resembles generic AI-generated text vs personal explanation."""
    ai_templates = [
        "This algorithm works by dividing the problem into smaller subproblems.",
        "The time complexity of this approach is O(n log n).",
        "In object-oriented programming, encapsulation refers to bundling data.",
        "Machine learning models are trained using gradient descent optimization.",
        "The main advantage of this data structure is its constant time lookup.",
        "RESTful APIs use HTTP methods like GET POST PUT DELETE.",
        "Recursion is a technique where a function calls itself with a base case.",
        "Polymorphism allows objects of different classes to be treated uniformly.",
    ]
    if not answer or len(answer.split()) < 5:
        return 0.0
    try:
        vectorizer = TfidfVectorizer()
        corpus = ai_templates + [answer]
        tfidf = vectorizer.fit_transform(corpus)
        sims = cosine_similarity(tfidf[-1], tfidf[:-1])
        return float(sims.max())
    except Exception:
        return 0.0


def compute_final_result(session: dict) -> dict:
    qa_pairs = session["qa"]
    skills = session["skills"]
    proctoring = session["proctoring"]
    personality = session.get("personality") or DEFAULT_PERSONALITY
    difficulty = session.get("difficulty") or DEFAULT_DIFFICULTY
    resume_text = session.get("resume_text", "")

    answer_scores = []
    plagiarism_flags = 0
    detailed_feedback = []

    # Most answers are already evaluated in the background while the person
    # is still doing the interview (see _evaluate_and_store). Whatever is
    # still missing/failed by the time they reach this page gets evaluated
    # now — IN PARALLEL rather than one at a time, since that used to mean
    # e.g. 5 pending questions x up to ~15s each = well over a minute of
    # sequential waiting. We NEVER substitute local heuristic scoring here.
    pending = [qa for qa in qa_pairs if not qa.get("evaluation") or qa["evaluation"].get("evaluation_failed")]
    if pending:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(6, len(pending))) as pool:
            futures = {
                pool.submit(
                    evaluate_answer_full, qa["question"], qa.get("answer") or "", skills,
                    personality, difficulty, resume_text, qa_pairs,
                ): qa
                for qa in pending
            }
            for future in concurrent.futures.as_completed(futures):
                futures[future]["evaluation"] = future.result()

    for qa in qa_pairs:
        evaluation = qa.get("evaluation")

        sim = cosine_similarity_score(qa.get("answer") or "")
        if sim > 0.75:
            plagiarism_flags += 1

        if not evaluation or evaluation.get("evaluation_failed"):
            detailed_feedback.append({
                "question": qa["question"],
                "answer": qa.get("answer"),
                "evaluation_available": False,
                "error_reason": (evaluation or {}).get("error_reason", "The AI evaluator is temporarily unavailable."),
                "thinking_time_seconds": qa.get("thinking_time_seconds"),
            })
            continue

        answer_scores.append(evaluation["overall_score"])
        detailed_feedback.append({
            "question": qa["question"],
            "answer": qa.get("answer"),
            "evaluation_available": True,
            "correctness": evaluation.get("correctness"),
            "technical_accuracy_10": evaluation.get("technical_accuracy_10"),
            "confidence_level": evaluation.get("confidence_level"),
            "completeness": evaluation.get("completeness"),
            "communication_score_10": evaluation.get("communication_score_10"),
            "positive_feedback": evaluation.get("positive_feedback"),
            "mistakes": evaluation.get("mistakes", []),
            "missing_concepts": evaluation.get("missing_concepts", []),
            "study_recommendations": evaluation.get("study_recommendations", []),
            "better_answer_example": evaluation.get("better_answer_example"),
            "difficulty_assessment": evaluation.get("difficulty_assessment"),
            "strength_meters": evaluation.get("strength_meters", {}),
            "overall_score": evaluation["overall_score"],
            "follow_up_question": evaluation.get("follow_up_question", ""),
            "thinking_time_seconds": qa.get("thinking_time_seconds"),
        })

    interview_score = sum(answer_scores) / len(answer_scores) if answer_scores else 0.0
    n_evaluated = max(1, len(answer_scores))

    overall_summary = generate_overall_summary(session, detailed_feedback)

    gaze_shifts = proctoring.get("gaze_shifts", 0)
    tab_switches = proctoring.get("tab_switches", 0)
    posture_violations = proctoring.get("posture_violations", 0)

    eye_contact_score = round(max(0.0, min(1.0, 1 - (gaze_shifts / (n_evaluated * 2)))), 3)
    posture_score = round(max(0.0, min(1.0, 1 - (posture_violations / (n_evaluated * 3)))), 3)

    thinking_times = [f.get("thinking_time_seconds") for f in detailed_feedback if isinstance(f.get("thinking_time_seconds"), (int, float))]
    avg_thinking_time = round(sum(thinking_times) / len(thinking_times), 1) if thinking_times else None
    if avg_thinking_time is None:
        time_management_score = 0.7
    elif 15 <= avg_thinking_time <= 90:
        time_management_score = 0.95
    else:
        distance = 15 - avg_thinking_time if avg_thinking_time < 15 else avg_thinking_time - 90
        time_management_score = max(0.3, 0.95 - distance / 120)
    time_management_score = round(time_management_score, 3)

    def _avg10(key: str) -> float:
        vals = [f.get(key) for f in detailed_feedback if isinstance(f.get(key), (int, float))]
        return round(sum(vals) / len(vals), 2) if vals else None

    def _avg_meter(key: str) -> float:
        vals = [f.get("strength_meters", {}).get(key) for f in detailed_feedback if isinstance(f.get("strength_meters", {}).get(key), (int, float))]
        return round(sum(vals) / len(vals), 1) if vals else None

    penalty = min(0.4, (gaze_shifts * 0.03) + (tab_switches * 0.05) + (plagiarism_flags * 0.08))
    final_score = max(0.0, interview_score - penalty)

    return {
        "final_score": round(final_score, 3),
        "interview_score": round(interview_score, 3),
        "gaze_shifts": gaze_shifts,
        "tab_switches": tab_switches,
        "plagiarism_flags": plagiarism_flags,
        "passed": final_score >= 0.5,
        "skills": skills,
        "per_question_scores": [round(s, 3) for s in answer_scores],
        "personality": personality,
        "difficulty": difficulty,
        "detailed_feedback": detailed_feedback,
        "overall_summary": overall_summary,
        # Skill-breakdown bars on the dashboard (0-10 scale unless noted).
        "dashboard_scores": {
            "technical_accuracy_10": _avg10("technical_accuracy_10"),
            "communication_10": _avg10("communication_score_10"),
            "confidence_10": _avg_meter("confidence"),
            "completeness_10": _avg_meter("completeness"),
            "eye_contact": eye_contact_score,
            "posture": posture_score,
            "time_management": time_management_score,
            "avg_thinking_time_seconds": avg_thinking_time,
            "questions_evaluated": len(answer_scores),
            "questions_total": len(qa_pairs),
        },
    }


# ══════════════════════════════════════════════════════════════════════════
# MODE 2 — GROQ: free-flowing conversational interview (second mode)
# ══════════════════════════════════════════════════════════════════════════

def build_chat_system_prompt(candidate_name: str, skills: list[str]) -> str:
    return f"""You are an experienced AI Technical Recruiter conducting a live interview.

Candidate Name: {candidate_name}
Candidate Skills: {', '.join(skills) if skills else 'Not specified'}

Interview Rules:
- Ask one question at a time.
- Be professional and friendly.
- Focus on the candidate's technical skills.
- Ask follow-up questions based on previous answers.
- Gradually increase difficulty.
- Keep responses concise.
- Do not answer your own questions.
- Reply with ONLY your next message to the candidate — no labels, no extra commentary."""


def build_chat_prompt(system_prompt: str, history: list[dict]) -> str:
    lines = [system_prompt, "\nConversation so far:"]
    if not history:
        lines.append("(interview has not started yet)")
    for turn in history:
        speaker = "Interviewer" if turn["role"] == "interviewer" else "Candidate"
        lines.append(f"{speaker}: {turn['text']}")
    lines.append("\nNow write the Interviewer's next message only.")
    return "\n".join(lines)


def chat_reply_locally(candidate_name: str, history: list[dict]) -> str:
    if not history:
        return (
            f"Hello {candidate_name}! Thank you for joining me today. "
            "Let's start off naturally—could you please introduce yourself "
            "and tell me a bit about your background and technical stack?"
        )
    fallback_questions = [
        "That's helpful, thanks. Can you walk me through a specific project in more detail?",
        "Interesting. What was the biggest technical challenge you faced there, and how did you solve it?",
        "Good. How do you usually approach debugging a tricky issue in your code?",
        "Understood. Can you tell me about a time you had to learn a new technology quickly?",
        "Thanks for sharing. Is there anything else about your experience you'd like to highlight?",
    ]
    idx = min(len([t for t in history if t["role"] == "candidate"]) - 1, len(fallback_questions) - 1)
    return fallback_questions[max(0, idx)]


def get_chat_reply(candidate_name: str, skills: list[str], history: list[dict]) -> str:
    system_prompt = build_chat_system_prompt(candidate_name, skills)
    prompt = build_chat_prompt(system_prompt, history)
    try:
        return get_groq_text(prompt, "continue the interview conversation")
    except HTTPException as exc:
        if is_quota_error(exc):
            return chat_reply_locally(candidate_name, history)
        raise


def evaluate_chat_locally(history: list[dict]) -> dict:
    candidate_turns = [t["text"] for t in history if t["role"] == "candidate"]
    total_words = sum(len(t.split()) for t in candidate_turns)
    avg_words = total_words / len(candidate_turns) if candidate_turns else 0
    score = max(1, min(10, round(3 + avg_words / 15)))
    return {
        "score": str(score),
        "feedback": "Automated fallback evaluation generated locally because the AI service was unavailable.",
        "strengths": ["Participated actively in the conversation"],
        "improvements": ["Provide more detailed, example-driven answers"],
    }


# ══════════════════════════════════════════════════════════════════════════
# ROUTES — auth (signup / login)
# ══════════════════════════════════════════════════════════════════════════

@app.post("/api/signup")
async def signup(req: SignupRequest):
    email = req.email.strip().lower()
    if not email or not req.password or not req.name.strip():
        raise HTTPException(400, "Name, email, and password are all required.")

    users = load_users()
    if email in users:
        raise HTTPException(409, "An account with this email already exists.")

    salt = secrets.token_hex(16)
    users[email] = {
        "name": req.name.strip(),
        "salt": salt,
        "password_hash": hash_password(req.password, salt),
    }
    save_users(users)
    return {"message": "Account created.", "user": {"name": req.name.strip(), "email": email}}


@app.post("/api/login")
async def login(req: LoginRequest):
    email = req.email.strip().lower()
    users = load_users()
    user = users.get(email)
    if not user or hash_password(req.password, user["salt"]) != user["password_hash"]:
        raise HTTPException(401, "Invalid email or password.")
    return {"message": "Login successful.", "user": {"name": user["name"], "email": email}}


# ══════════════════════════════════════════════════════════════════════════
# ROUTES — shared resume upload
# ══════════════════════════════════════════════════════════════════════════

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported.")
    tmp_path = None
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        resume_text = extract_text_from_pdf(tmp_path)
    except Exception as exc:
        raise HTTPException(400, f"Could not read this PDF: {exc}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
    if not resume_text:
        raise HTTPException(400, "Could not extract text from PDF.")

    skills = extract_skills(resume_text)
    candidate_name = extract_name_locally(resume_text)

    session_id = os.urandom(8).hex()
    sessions[session_id] = {
        "skills": skills,
        "resume_text": resume_text,
        "candidate_name": candidate_name,
        # structured mode state
        "qa": [],
        "proctoring": {"gaze_shifts": 0, "tab_switches": 0},
        "done": False,
        # conversational mode state
        "chat_history": [],
        # personality/difficulty + adaptive batching state (additive)
        "personality": None,
        "difficulty": None,
        "pending_batch": [],
    }
    return {
        "session_id": session_id,
        "skills": skills,
        "candidate_name": candidate_name,
    }


# ══════════════════════════════════════════════════════════════════════════
# ROUTES — Mode 1 (Groq): structured 5-question interview
# ══════════════════════════════════════════════════════════════════════════

class AnswerRequest(BaseModel):
    session_id: str
    answer: str = ""
    # Sent once, typically with the very first call (question_number == 1).
    # Selected on the login page. Ignored on later calls once already set.
    personality: Optional[str] = None
    difficulty: Optional[str] = None
    # Seconds between the question being shown and the answer being submitted
    # (tracked client-side). Used only for the "Thinking Time" / "Time
    # Management" stats on the result dashboard — optional, defaults ignored.
    thinking_time_seconds: Optional[float] = None


def _evaluate_and_store(qa_item: dict, skills: list, personality: Optional[str], difficulty: Optional[str], resume_text: str, previous_qa_snapshot: list):
    """Runs the Groq evaluation for one answer in the background so the
    person isn't stuck waiting on the next-question response for it. The
    result page will pick up whatever's here, and re-evaluate anything that's
    still missing/failed when it loads."""
    qa_item["evaluation"] = evaluate_answer_full(
        qa_item["question"], qa_item.get("answer") or "", skills, personality, difficulty,
        resume_text=resume_text, previous_qa=previous_qa_snapshot,
    )


@app.post("/api/next-question")
async def next_question(req: AnswerRequest, background_tasks: BackgroundTasks):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    if session["done"]:
        raise HTTPException(400, "Interview already completed.")

    # Lock in personality/difficulty the first time they're provided.
    if req.personality and not session.get("personality"):
        session["personality"] = req.personality.lower()
    if req.difficulty and not session.get("difficulty"):
        session["difficulty"] = req.difficulty.lower()

    # Save the previous answer and evaluate it in the BACKGROUND — this is
    # the main latency fix: previously the whole request waited on a full
    # Groq call here before it could return the next question, so every
    # answer added several extra seconds (or more, on retries) of dead time.
    if session["qa"] and session["qa"][-1].get("answer") is None:
        session["qa"][-1]["answer"] = req.answer
        session["qa"][-1]["thinking_time_seconds"] = req.thinking_time_seconds
        background_tasks.add_task(
            _evaluate_and_store, session["qa"][-1], session["skills"],
            session.get("personality"), session.get("difficulty"),
            session.get("resume_text", ""), list(session["qa"]),
        )

    if len(session["qa"]) >= MAX_QUESTIONS:
        session["done"] = True
        return {"done": True, "message": "Interview complete."}

    # Refill the batch of questions from Groq once the current one is empty.
    if not session.get("pending_batch"):
        batch_number = (len(session["qa"]) // QUESTIONS_PER_BATCH) + 1
        session["pending_batch"] = generate_question_batch(session, batch_number)

    question = session["pending_batch"].pop(0)
    q_num = len(session["qa"]) + 1
    session["qa"].append({"question": question, "answer": None, "evaluation": None})
    return {
        "done": False,
        "question": question,
        "question_number": q_num,
        "total_questions": MAX_QUESTIONS,
        "personality": session.get("personality") or DEFAULT_PERSONALITY,
        "difficulty": session.get("difficulty") or DEFAULT_DIFFICULTY,
    }


@app.post("/api/submit-answer")
async def submit_answer(req: AnswerRequest, background_tasks: BackgroundTasks):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    if session["qa"] and session["qa"][-1].get("answer") is None:
        session["qa"][-1]["answer"] = req.answer
        session["qa"][-1]["thinking_time_seconds"] = req.thinking_time_seconds
        background_tasks.add_task(
            _evaluate_and_store, session["qa"][-1], session["skills"],
            session.get("personality"), session.get("difficulty"),
            session.get("resume_text", ""), list(session["qa"]),
        )
    return {"status": "saved"}


class ProctoringUpdate(BaseModel):
    session_id: str
    gaze_shifts: int
    tab_switches: int
    # How many times posture/body-stability drifted out of range during the
    # interview (tracked client-side, throttled). Optional/additive — used
    # only for the Posture Score on the result dashboard.
    posture_violations: Optional[int] = None


@app.post("/api/update-proctoring")
async def update_proctoring(req: ProctoringUpdate):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    session["proctoring"]["gaze_shifts"] = req.gaze_shifts
    session["proctoring"]["tab_switches"] = req.tab_switches
    if req.posture_violations is not None:
        session["proctoring"]["posture_violations"] = req.posture_violations
    return {"status": "updated"}


@app.get("/api/result/{session_id}")
async def get_result(session_id: str):
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    if session["qa"] and session["qa"][-1].get("answer") is None:
        session["qa"][-1]["answer"] = "(No answer provided)"
    result = compute_final_result(session)
    return result


# ══════════════════════════════════════════════════════════════════════════
# ROUTES — Mode 2 (Groq): conversational interview
# ══════════════════════════════════════════════════════════════════════════

class ChatStartRequest(BaseModel):
    session_id: str
    candidate_name: Optional[str] = None


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str


class ChatEvaluationRequest(BaseModel):
    session_id: str


@app.post("/api/chat-interview/start")
async def chat_interview_start(req: ChatStartRequest):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Upload a resume first.")

    if req.candidate_name:
        session["candidate_name"] = req.candidate_name

    session["chat_history"] = []
    bot_reply = get_chat_reply(session["candidate_name"], session["skills"], session["chat_history"])
    session["chat_history"].append({"role": "interviewer", "text": bot_reply})
    return {"bot_speech": bot_reply}


@app.post("/api/chat-interview/message")
async def chat_interview_message(req: ChatMessageRequest):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    if not session["chat_history"]:
        raise HTTPException(400, "Chat interview has not been started. Call /api/chat-interview/start first.")

    session["chat_history"].append({"role": "candidate", "text": req.message})
    bot_reply = get_chat_reply(session["candidate_name"], session["skills"], session["chat_history"])
    session["chat_history"].append({"role": "interviewer", "text": bot_reply})
    return {"bot_speech": bot_reply}


@app.post("/api/chat-interview/evaluation")
async def chat_interview_evaluation(req: ChatEvaluationRequest):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")
    if not session["chat_history"]:
        raise HTTPException(400, "No chat interview history to evaluate.")

    evaluation_prompt = f"""
Analyze this interview history and provide a professional evaluation.
Candidate: {session['candidate_name']}
Skills: {', '.join(session['skills'])}

Provide the output in this exact JSON format:
{{
    "score": "0-10",
    "feedback": "...",
    "strengths": ["...", "..."],
    "improvements": ["...", "..."]
}}

Interview History: {json.dumps(session['chat_history'])}
"""
    try:
        raw_text = get_groq_text(evaluation_prompt, "evaluate the chat interview")
        evaluation = parse_model_json(raw_text, "Groq could not produce a valid evaluation. Please try again.")
    except HTTPException as exc:
        if is_quota_error(exc):
            evaluation = evaluate_chat_locally(session["chat_history"])
        else:
            raise
    return {"evaluation": evaluation}


# ══════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ══════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "message": "InterviewAI backend running — Groq structured mode + Groq conversational mode",
        "groq_configured": bool(GROQ_API_KEY),
        "groq_model": GROQ_MODEL,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)