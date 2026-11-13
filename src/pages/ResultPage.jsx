import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { readApiResponse } from '../api.js'
import '../appShell.css'
import '../sidePanel.css'

const API = ''

/* ── Icons ─────────────────────────────────────────────────────────────── */
const IconArrow = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l6 6L20 6" />
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)
const IconDash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
)
const IconChevron = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" /><path d="M4 19.5h16" />
  </svg>
)
const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" />
  </svg>
)
const IconRetry = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 11A8 8 0 105 16.9M20 11V5m0 6h-6" />
  </svg>
)
const IconSparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)
const IconTarget = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="#fff" />
  </svg>
)
const IconBrain = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4a3 3 0 00-3 3v1a3 3 0 000 6v1a3 3 0 003 3M15 4a3 3 0 013 3v1a3 3 0 010 6v1a3 3 0 01-3 3M9 4v16M15 4v16" />
  </svg>
)
const IconChart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19V9M12 19V4M20 19v-6" />
  </svg>
)
const IconBriefcase = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)
const IconTrophy = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4h8v5a4 4 0 01-8 0V4z" /><path d="M8 4H4v2a3 3 0 003 3M16 4h4v2a3 3 0 01-3 3" /><path d="M12 13v3M9 20h6M10 16.5h4" />
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
)

const CORRECTNESS_META = {
  correct: { label: 'Correct', icon: <IconCheck />, color: 'var(--accent-success)' },
  partially_correct: { label: 'Partially Correct', icon: <IconDash />, color: 'var(--accent-warning)' },
  incorrect: { label: 'Incorrect', icon: <IconX />, color: 'var(--accent-error)' },
}
const COMPLETENESS_META = {
  complete: { label: 'Complete', color: 'var(--accent-success)' },
  mostly_complete: { label: 'Mostly Complete', color: 'var(--accent-warning)' },
  incomplete: { label: 'Incomplete', color: 'var(--accent-error)' },
}

const BENEFITS = [
  { icon: <IconTarget />, title: 'Realistic AI Interviews', text: 'Practice role-specific interviews generated by AI.' },
  { icon: <IconBrain />, title: 'Smart Feedback', text: 'Receive actionable suggestions after every interview.' },
  { icon: <IconChart />, title: 'Track Your Progress', text: 'Measure improvement across multiple sessions.' },
  { icon: <IconBriefcase />, title: 'Career Ready', text: 'Prepare confidently for real company interviews.' },
  { icon: <IconTrophy />, title: 'Build Confidence', text: 'Practice consistently and reduce interview anxiety.' },
]

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Adobe', 'Oracle', 'IBM', 'NVIDIA', 'OpenAI', 'Tesla']

function ScoreBar({ label, value, max = 10, color = 'var(--grad-blue)' }) {
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))
  return (
    <div style={{ marginBottom: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
        <span style={{ color: 'var(--app-text-secondary)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: 'var(--app-text-primary)', fontWeight: 700 }}>{value ?? '—'}{max === 10 ? '/10' : '%'}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function CircleScore({ value, label, color, size = 104 }) {
  const r = size / 2 - 10
  const circumference = 2 * Math.PI * r
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fill={color} fontSize={size / 5.2} fontWeight="800" fontFamily="Sora, sans-serif">
          {Math.round(value)}{label.includes('/ 100') ? '' : '%'}
        </text>
      </svg>
      <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function QuestionCard({ f, index }) {
  const [open, setOpen] = useState(false)

  if (f.evaluation_available === false) {
    return (
      <div className="glass-panel" style={{ padding: '0.9rem 1rem', marginBottom: '0.6rem', border: '1px solid rgba(255,107,122,0.3)' }}>
        <div style={{ color: 'var(--app-text-primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>Q{index + 1}. {f.question}</div>
        <div style={{ color: 'var(--accent-error)', fontSize: '0.82rem' }}>⚠ Evaluation unavailable — refresh this page to retry.</div>
      </div>
    )
  }

  const correctness = CORRECTNESS_META[f.correctness] || CORRECTNESS_META.partially_correct
  const completeness = COMPLETENESS_META[f.completeness] || COMPLETENESS_META.mostly_complete
  const meters = f.strength_meters || {}

  return (
    <div className="glass-panel" style={{ padding: '0.9rem 1rem', marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', gap: '0.7rem' }} onClick={() => setOpen((o) => !o)}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--app-text-primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>Q{index + 1}. {f.question}</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="status-badge" style={{ color: correctness.color, borderColor: `${correctness.color}55`, fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>
              {correctness.icon} {correctness.label}
            </span>
            <span className="chip" style={{ fontSize: '0.7rem' }}>Technical {f.technical_accuracy_10}/10</span>
            <span className="chip" style={{ fontSize: '0.7rem' }}>{completeness.label}</span>
          </div>
        </div>
        <IconChevron open={open} />
      </div>

      {open && (
        <div style={{ marginTop: '0.9rem', borderTop: '1px solid var(--app-panel-border)', paddingTop: '0.9rem' }}>
          {f.answer && (
            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Your Answer</div>
              <div style={{ color: 'var(--app-text-primary)', fontSize: '0.83rem', lineHeight: 1.55, opacity: 0.9 }}>{f.answer}</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem 1.2rem', marginBottom: '0.8rem' }}>
            <ScoreBar label="Technical" value={meters.technical_understanding} max={100} color="var(--grad-blue)" />
            <ScoreBar label="Communication" value={meters.communication} max={100} color="var(--grad-cyan)" />
            <ScoreBar label="Confidence" value={meters.confidence} max={100} color="var(--grad-purple)" />
            <ScoreBar label="Completeness" value={meters.completeness} max={100} color="var(--accent-success)" />
          </div>
          {f.positive_feedback && (
            <div style={{ marginBottom: '0.7rem' }}>
              <div style={{ color: 'var(--accent-success)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>✓ What you did well</div>
              <div style={{ color: 'var(--app-text-primary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{f.positive_feedback}</div>
            </div>
          )}
          {(f.mistakes || []).length > 0 && (
            <div style={{ marginBottom: '0.7rem' }}>
              <div style={{ color: 'var(--accent-error)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>✗ Mistakes</div>
              {f.mistakes.map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,107,122,0.08)', border: '1px solid rgba(255,107,122,0.25)', borderRadius: '8px', padding: '0.5rem 0.7rem', marginBottom: '0.35rem' }}>
                  <div style={{ color: 'var(--app-text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>{m.mistake}</div>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.76rem', marginTop: '0.15rem' }}>{m.why_wrong}</div>
                </div>
              ))}
            </div>
          )}
          {(f.missing_concepts || []).length > 0 && (
            <div style={{ marginBottom: '0.7rem' }}>
              <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>Missing Concepts</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {f.missing_concepts.map((c, i) => <span key={i} className="chip" style={{ fontSize: '0.72rem' }}>{c}</span>)}
              </div>
            </div>
          )}
          {(f.study_recommendations || []).length > 0 && (
            <div style={{ marginBottom: '0.7rem' }}>
              <div style={{ color: 'var(--grad-cyan)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>📚 Study Recommendations</div>
              {f.study_recommendations.map((r, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: 'var(--app-text-primary)', marginBottom: '0.2rem' }}>
                  <strong>{r.topic}</strong> — <span style={{ color: 'var(--app-text-secondary)' }}>{r.why}</span>
                </div>
              ))}
            </div>
          )}
          {f.better_answer_example && (
            <div>
              <div style={{ color: 'var(--grad-purple)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>💡 A Stronger Answer</div>
              <div style={{ color: 'var(--app-text-primary)', fontSize: '0.81rem', lineHeight: 1.55, fontStyle: 'italic', opacity: 0.9 }}>{f.better_answer_example}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Growth journey chart — a cosmetic, illustrative analytics widget ──── */
function GrowthJourneyChart() {
  const points = [18, 34, 46, 62, 78] // illustrative interview-over-interview trend
  const w = 260, h = 90
  const step = w / (points.length - 1)
  const norm = (v) => h - (v / 100) * h
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${norm(v)}`).join(' ')
  return (
    <div className="growth-chart-wrap">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--grad-blue)" />
            <stop offset="100%" stopColor="var(--grad-cyan)" />
          </linearGradient>
        </defs>
        <path className="growth-line" d={path} />
        {points.map((v, i) => (
          <circle key={i} className="growth-dot" cx={i * step} cy={norm(v)} r="3.4" />
        ))}
      </svg>
      <div className="growth-labels">
        {points.map((_, i) => <span key={i}>Int. {i + 1}</span>)}
      </div>
      <div className="growth-stat">▲ 27% improvement over your last five interviews</div>
    </div>
  )
}

/* ── Side panel content, shared between desktop (sticky) and mobile (collapsible) ── */
function SidePanelContent() {
  return (
    <>
      <div className="glass-card side-card side-hero">
        <div className="app-brand-row">
          <div className="app-brand-logo"><IconSparkle /></div>
          <span className="app-brand-name" style={{ fontSize: '1.3rem' }}>AI Interview</span>
        </div>
        <div className="side-hero-tag">Practice Smarter. Get Hired Faster.</div>
      </div>

      <div className="glass-card side-card">
        <div className="side-headline">Every Interview Is a Step Towards Your Dream Role</div>
        <div className="side-sub">AI-powered interview practice that helps you improve technical knowledge, communication, confidence, and interview readiness.</div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>Why Practice Here</div>
        <div className="benefit-list">
          {BENEFITS.map((b) => (
            <div className="benefit-card" key={b.title}>
              <div className="benefit-icon">{b.icon}</div>
              <div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-text">{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>Your Growth Journey</div>
        <GrowthJourneyChart />
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.8rem' }}>Companies You Can Prepare For</div>
        <div className="company-grid">
          {COMPANIES.map((c) => <span className="company-chip" key={c}>{c}</span>)}
        </div>
      </div>

      <div className="glass-card side-card">
        <div className="side-testimonial-stars">★★★★★</div>
        <div className="side-testimonial-quote">"The AI feedback helped me identify weak areas and crack interviews I never thought I could."</div>
        <div className="side-testimonial-author">Sneha R.</div>
        <div className="side-testimonial-role">Data Analyst</div>
      </div>

      <div className="glass-card side-card privacy-card">
        <div className="privacy-icon"><IconLock /></div>
        <div>
          <div className="privacy-title">Your Privacy Is Our Priority</div>
          <div className="privacy-text">Your interview recordings, responses, and reports are securely processed and never shared without your permission.</div>
        </div>
      </div>
    </>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const sessionId = sessionStorage.getItem('session_id')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const loadResult = () => {
    setLoading(true)
    setError('')
    fetch(`${API}/api/result/${sessionId}`)
      .then((r) => readApiResponse(r, 'Failed to load result.'))
      .then((d) => { setResult(d); setLoading(false) })
      .catch((e) => { setError(e.message || 'Failed to load result.'); setLoading(false) })
  }

  useEffect(() => {
    if (!sessionId) { navigate('/'); return }
    loadResult()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const pct = (v) => Math.round((v || 0) * 100)

  const handleDownloadPdf = () => window.print()
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-report-${sessionId?.slice(0, 8) || 'result'}.json`
    a.click()
    URL.revokeObjectURL(url)
    setToast('Report exported as JSON.')
  }
  const handleShare = async () => {
    const text = `InterviewIQ AI — Overall Score: ${overallScore100}/100 (${verdict})`
    if (navigator.share) {
      try { await navigator.share({ title: 'My Interview Results', text }) } catch (e) { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(text); setToast('Summary copied to clipboard.') }
      catch (e) { setToast('Could not share — copy manually.') }
    }
  }

  if (loading) return (
    <div className="app-page premium-type" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-ambient" aria-hidden="true">
        <span className="p-ring" /><span className="p-glow-a" /><span className="p-glow-b" /><span className="p-grid" />
      </div>
      <div style={{ color: 'var(--grad-cyan)', fontSize: '1.1rem', fontWeight: 600, position: 'relative', zIndex: 1 }}>
        <span className="app-spinner" style={{ marginRight: '0.6rem', verticalAlign: 'middle' }} />
        Calculating your results...
      </div>
    </div>
  )
  if (error) return (
    <div className="app-page premium-type" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-ambient" aria-hidden="true">
        <span className="p-ring" /><span className="p-glow-a" /><span className="p-glow-b" /><span className="p-grid" />
      </div>
      <div style={{ color: 'var(--accent-error)', position: 'relative', zIndex: 1, fontWeight: 600 }}>{error}</div>
    </div>
  )
  if (!result) return null

  const detailedFeedback = result.detailed_feedback || []
  const dash = result.dashboard_scores || {}
  const summary = result.overall_summary || {}
  const summaryFailed = summary.summary_failed
  const overallScore100 = summary.overall_score_100 ?? Math.round((result.final_score || 0) * 100)
  const verdict = summary.verdict || (result.passed ? 'Strong Candidate' : 'Needs Improvement')
  const verdictColor = result.passed ? 'var(--accent-success)' : 'var(--accent-error)'

  const finalPct = pct(result.final_score)
  const interviewPct = pct(result.interview_score)
  const integrityPct = Math.max(0, 100 - result.gaze_shifts * 10 - result.tab_switches * 15 - result.plagiarism_flags * 15)

  return (
    <div className="app-page premium-type">
      <div className="premium-ambient" aria-hidden="true">
        <span className="p-ring" /><span className="p-glow-a" /><span className="p-glow-b" /><span className="p-grid" />
      </div>
      <div className="split-shell result-shell">
        {/* ── Desktop sticky side panel ─────────────────────────────────── */}
        <div className="side-panel-cell">
          <div className="side-panel">
            <SidePanelContent />
          </div>
        </div>

        <div className="split-main">
          {/* ── Mobile collapsible panel (above the results dashboard) ───── */}
          <details className="side-collapsible" style={{ width: '100%', maxWidth: '760px' }}>
            <summary>Your AI Career Coach</summary>
            <div className="side-collapsible-body">
              <SidePanelContent />
            </div>
          </details>

          <div style={{ width: '100%', maxWidth: '760px', position: 'relative', zIndex: 1 }}>

            {/* ── Header + scores + proctoring (ONE card, matches original layout) ── */}
            <div className="glass-card fade-slide-up" style={{ padding: '2.25rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.1rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--app-text-muted)', fontSize: '0.78rem', fontWeight: 600, padding: 0,
                }}
              >
                <IconArrowLeft /> Back
              </button>
              <div className="app-heading" style={{ fontSize: '1.7rem', textAlign: 'center', marginBottom: '0.6rem' }}>
                {result.passed ? '🎉 Interview Complete' : '📋 Interview Complete'}
              </div>
              <div style={{ textAlign: 'center', marginBottom: '0.9rem' }}>
                <span className={`status-badge ${result.passed ? 'ok' : 'bad'}`} style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
                  {result.passed ? <><IconCheck /> Passed — {verdict}</> : <><IconX /> Not Passed — {verdict}</>}
                </span>
              </div>
              <div className="app-subtitle" style={{ textAlign: 'center', color: verdictColor, marginBottom: '1.5rem' }}>
                {result.passed
                  ? 'Congratulations! Your performance meets the standard.'
                  : 'Your overall score did not meet the 50% threshold. Review the feedback below and try again.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <CircleScore value={finalPct} label="Final Score" color={finalPct >= 50 ? 'var(--accent-success)' : 'var(--accent-error)'} />
                <CircleScore value={interviewPct} label="Interview Score" color="var(--grad-blue)" />
                <CircleScore value={integrityPct} label="Integrity Score" color="var(--accent-warning)" />
              </div>

              {summaryFailed ? (
                <div style={{ color: 'var(--accent-error)', fontSize: '0.85rem', textAlign: 'center' }}>
                  ⚠ AI summary temporarily unavailable.
                  <button className="app-btn-secondary" style={{ marginLeft: '0.6rem', padding: '0.35rem 0.8rem', fontSize: '0.78rem' }} onClick={loadResult}><IconRetry /> Retry</button>
                </div>
              ) : summary.motivational_feedback && (
                <div className="app-subtitle" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>{summary.motivational_feedback}</div>
              )}

              <div className="app-eyebrow" style={{ marginBottom: '0.7rem' }}>Proctoring Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '0.7rem' }}>
                <div className="glass-panel" style={{ padding: '0.8rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: result.gaze_shifts > 3 ? 'var(--accent-error)' : 'var(--accent-success)' }}>{result.gaze_shifts}</div>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>Gaze Shifts</div>
                </div>
                <div className="glass-panel" style={{ padding: '0.8rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: result.tab_switches > 0 ? 'var(--accent-error)' : 'var(--accent-success)' }}>{result.tab_switches}</div>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>Tab Switches</div>
                </div>
                <div className="glass-panel" style={{ padding: '0.8rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: result.plagiarism_flags > 0 ? 'var(--accent-error)' : 'var(--accent-success)' }}>{result.plagiarism_flags}</div>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>AI-answer Flags</div>
                </div>
              </div>
            </div>

            {/* ── Category scores + Per-question performance (ONE card) ───────── */}
            <div className="glass-card fade-slide-up" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
              <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>Category Scores</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.3rem 2rem', marginBottom: '1.5rem' }}>
                <ScoreBar label="Technical Knowledge" value={dash.technical_accuracy_10} color="var(--grad-blue)" />
                <ScoreBar label="Communication" value={dash.communication_10} color="var(--grad-cyan)" />
                <ScoreBar label="Confidence" value={dash.confidence_10} color="var(--grad-purple)" />
                <ScoreBar label="Completeness" value={dash.completeness_10} color="var(--accent-success)" />
                <ScoreBar label="Eye Contact" value={Math.round((dash.eye_contact || 0) * 10)} color="var(--grad-cyan)" />
                <ScoreBar label="Posture" value={Math.round((dash.posture || 0) * 10)} color="var(--grad-blue)" />
                <ScoreBar label="Time Management" value={Math.round((dash.time_management || 0) * 10)} color="var(--grad-purple)" />
              </div>

              <div className="app-eyebrow" style={{ marginBottom: '0.7rem' }}>Per-Question Performance</div>
              {(result.per_question_scores || []).map((score, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.82rem', width: '32px', fontWeight: 600 }}>Q{i + 1}</div>
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className={`progress-fill${score < 0.5 ? ' warn' : ''}`} style={{ width: `${pct(score)}%` }} />
                  </div>
                  <div style={{ color: 'var(--app-text-primary)', fontWeight: 700, fontSize: '0.8rem', width: '36px', textAlign: 'right' }}>{pct(score)}%</div>
                </div>
              ))}
              {dash.questions_evaluated < dash.questions_total && (
                <div style={{ color: 'var(--accent-warning)', fontSize: '0.78rem', marginTop: '0.6rem' }}>
                  {dash.questions_total - dash.questions_evaluated} question(s) still pending AI evaluation — refresh to retry.
                </div>
              )}
            </div>

            {/* ── AI Summary + Skill Gap Analysis + Job Recommendations (ONE card) ── */}
            {!summaryFailed && (
              <div className="glass-card fade-slide-up" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>AI Summary &amp; Skill Gap Analysis</div>

                {summary.knowledge_gap_analysis?.summary && (
                  <div style={{ color: 'var(--app-text-primary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.1rem' }}>{summary.knowledge_gap_analysis.summary}</div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <div style={{ color: 'var(--accent-success)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>✓ Current Strengths</div>
                    {(summary.strengths || []).map((s, i) => <div key={i} style={{ fontSize: '0.82rem', color: 'var(--app-text-primary)', padding: '0.25rem 0' }}>• {s}</div>)}
                  </div>
                  <div>
                    <div style={{ color: 'var(--accent-warning)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>△ Needs Improvement</div>
                    {(summary.weak_areas || []).map((s, i) => <div key={i} style={{ fontSize: '0.82rem', color: 'var(--app-text-primary)', padding: '0.25rem 0' }}>• {s}</div>)}
                  </div>
                </div>

                {(summary.knowledge_gap_analysis?.gaps || []).length > 0 && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <div style={{ color: 'var(--accent-error)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>Missing Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {summary.knowledge_gap_analysis.gaps.map((g, i) => <span key={i} className="chip" style={{ borderColor: 'rgba(255,107,122,0.3)', color: '#ffb3ba' }}>{g}</span>)}
                    </div>
                  </div>
                )}

                {(summary.learning_roadmap || []).length > 0 && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <div style={{ color: 'var(--grad-cyan)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>📚 Learning Roadmap</div>
                    {summary.learning_roadmap.map((w, i) => (
                      <div key={i} style={{ fontSize: '0.82rem', color: 'var(--app-text-primary)', padding: '0.25rem 0' }}>
                        <strong>Week {w.week} — {w.focus}:</strong> <span style={{ color: 'var(--app-text-secondary)' }}>{(w.topics || []).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(summary.job_recommendations || []).length > 0 && (
                  <div>
                    <div style={{ color: 'var(--grad-purple)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.6rem' }}>💼 Job Recommendations</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                      {summary.job_recommendations.map((j, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '0.7rem 0.9rem' }}>
                          <div style={{ color: 'var(--app-text-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{j.role}</div>
                          <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>{j.why_fit}</div>
                          {(j.skills_to_learn || []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                              {j.skills_to_learn.map((sk, k) => <span key={k} className="chip" style={{ fontSize: '0.68rem' }}>{sk}</span>)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Question-wise evaluation ─────────────────────────────────────── */}
            <div className="glass-card fade-slide-up" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
              <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>Question-by-Question Evaluation</div>
              {detailedFeedback.map((f, i) => <QuestionCard key={i} f={f} index={i} />)}
            </div>

            {/* ── Skills assessed + actions ─────────────────────────────────────── */}
            <div className="glass-card fade-slide-up" style={{ padding: '2rem' }}>
              <div className="app-eyebrow" style={{ marginBottom: '0.7rem' }}>Skills Assessed</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {(result.skills || []).map((sk, i) => <span key={i} className="chip">{sk}</span>)}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <button className="app-btn-secondary" style={{ flex: '1 1 160px' }} onClick={handleDownloadPdf}><IconDownload /> Download Report</button>
                <button className="app-btn-secondary" style={{ flex: '1 1 160px' }} onClick={handleExportJson}><IconDownload /> Export JSON</button>
                <button className="app-btn-secondary" style={{ flex: '1 1 160px' }} onClick={handleShare}><IconShare /> Share Results</button>
                <button className="app-btn-primary" style={{ flex: '1 1 160px' }} onClick={() => { sessionStorage.clear(); navigate('/') }}>
                  Retake Interview <IconArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast-note">{toast}</div>}
    </div>
  )
}