import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { readApiResponse } from '../api.js'
import '../authStyles.css'

/* ── Inline icon set (no external icon library in this project) ────────── */
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="M3 6.5l9 6.2 9-6.2" />
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
)
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
)
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A10.6 10.6 0 0112 5c7 0 10.5 7 10.5 7a15.7 15.7 0 01-3.9 4.6M6.6 6.6C3.6 8.5 1.5 12 1.5 12S5 19 12 19c1.4 0 2.6-.28 3.7-.75" />
    <path d="M9.5 9.8a3.2 3.2 0 004.5 4.5" />
  </svg>
)
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2 1.5-4.6 2.6-7.6 2.6-5.4 0-9.9-3.4-11.5-8.2l-6.6 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-2.9 5.1-5.4 6.7l6.5 5.5C39.9 37.6 44 31.7 44 24c0-1.3-.1-2.7-.4-3.5z" />
  </svg>
)
const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55v-2.14c-3.16.69-3.83-1.36-3.83-1.36-.52-1.32-1.26-1.67-1.26-1.67-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.74.4-1.23.72-1.51-2.53-.29-5.18-1.26-5.18-5.62 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 015.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.65 5.33-5.19 5.61.41.35.77 1.04.77 2.1v3.11c0 .3.21.66.79.55A11.26 11.26 0 0023.25 11.75C23.25 5.48 18.27.5 12 .5z" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
)
const IconSparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
)
const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 14.5a8.5 8.5 0 11-9-11 6.8 6.8 0 009 11z" />
  </svg>
)
const IconArrow = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const CheckmarkAnim = () => (
  <svg className="checkmark-wrap" width="20" height="20" viewBox="0 0 52 52">
    <circle className="checkmark-circle" cx="26" cy="26" r="24" />
    <path className="checkmark-check" d="M14 27l7 7 17-17" />
  </svg>
)

/* Career-path chip icons (reused across roles that share a discipline) */
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L2 12l6 8M16 4l6 8-6 8" /></svg>
)
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" /></svg>
)
const IconCpu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>
)
const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 18a4.5 4.5 0 010-9 5.5 5.5 0 0110.6-1.8A4 4 0 0119 15.5" /></svg>
)
const IconPalette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="1" fill="#fff" /><circle cx="14" cy="9" r="1" fill="#fff" /><circle cx="15" cy="14" r="1" fill="#fff" /></svg>
)
const IconDatabase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg>
)

const CAREER_CHIPS = [
  { icon: <IconCode />, label: 'Software Engineer' },
  { icon: <IconLayers />, label: 'Full Stack Developer' },
  { icon: <IconCpu />, label: 'AI / ML Engineer' },
  { icon: <IconDatabase />, label: 'Data Scientist' },
  { icon: <IconCloud />, label: 'DevOps Engineer' },
  { icon: <IconPalette />, label: 'UI/UX Designer' },
]

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Adobe', 'Oracle', 'NVIDIA', 'OpenAI', 'TCS', 'Infosys', 'Accenture']

const TESTIMONIALS = [
  { quote: 'The interview simulation felt almost identical to a real technical interview.', author: 'Software Engineer' },
  { quote: 'The personalized AI feedback helped me identify weak areas and improve much faster.', author: 'Data Scientist' },
]

const STATS = [
  { value: 50000, suffix: '+', label: 'Practice Interviews' },
  { value: 95, suffix: '%', label: 'User Satisfaction' },
  { value: 10000, suffix: '+', label: 'Successful Offers' },
  { value: 200, suffix: '+', label: 'Companies Covered' },
]

function useCountUp(target, duration = 1300) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function StatItem({ value, suffix, label }) {
  const animated = useCountUp(value)
  return (
    <div className="stat-item">
      <div className="stat-value mono">{animated.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function ReadinessRing({ percent = 82, size = 88, stroke = 8 }) {
  const [animatedOffset, setAnimatedOffset] = useState(null)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  useEffect(() => {
    const t = setTimeout(() => setAnimatedOffset(circumference * (1 - percent / 100)), 120)
    return () => clearTimeout(t)
  }, [percent, circumference])
  return (
    <div className="ring-wrap">
      <svg className="ring-svg" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} />
        <circle
          className="ring-progress"
          cx={size / 2} cy={size / 2} r={r}
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset === null ? circumference : animatedOffset}
        />
      </svg>
      <div className="ring-value mono">{percent}%</div>
    </div>
  )
}

function TestimonialRotator({ items }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000)
    return () => clearInterval(t)
  }, [items.length])
  const current = items[i]
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">★★★★★</div>
      <div className="testimonial-quote">&ldquo;{current.quote}&rdquo;</div>
      <div className="testimonial-author">— {current.author}</div>
    </div>
  )
}

const CAREER_GOALS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'python', label: 'Python Developer' },
  { value: 'java', label: 'Java Developer' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'ml_engineer', label: 'Machine Learning Engineer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'uiux', label: 'UI/UX Designer' },
  { value: 'software_engineer', label: 'Software Engineer' },
]
const EXPERIENCE_LEVELS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'fresher', label: 'Fresher' },
  { value: 'internship', label: 'Internship' },
  { value: 'experienced', label: 'Experienced' },
]
const PERSONALITIES = [
  { value: 'friendly', label: 'Friendly — warm & encouraging' },
  { value: 'professional', label: 'Professional — formal & corporate' },
  { value: 'strict', label: 'Strict — challenging & concise' },
  { value: 'adaptive', label: 'Adaptive — adjusts to your answers' },
  { value: 'beginner', label: 'Beginner-Friendly — patient & explanatory' },
]
const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState('dark')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [personality, setPersonality] = useState('professional')
  const [difficulty, setDifficulty] = useState('medium')
  const [careerGoal, setCareerGoal] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [toast, setToast] = useState('')

  const doubledCompanies = useMemo(() => [...COMPANIES, ...COMPANIES], [])

  useEffect(() => {
    document.documentElement.setAttribute('data-auththeme', theme)
    return () => document.documentElement.removeAttribute('data-auththeme')
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const validate = () => {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleLogin = async () => {
    setFormError('')
    if (!validate() || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await readApiResponse(res, 'Login failed')
      sessionStorage.setItem('user_name', data.user.name)
      sessionStorage.setItem('user_email', data.user.email)
      sessionStorage.setItem('interview_personality', personality)
      sessionStorage.setItem('interview_difficulty', difficulty)
      if (careerGoal) sessionStorage.setItem('career_goal', careerGoal)
      if (experienceLevel) sessionStorage.setItem('experience_level', experienceLevel)
      if (remember) localStorage.setItem('remembered_email', email.trim())
      else localStorage.removeItem('remembered_email')
      setStatus('success')
      setTimeout(() => navigate('/upload'), 900)
    } catch (e) {
      setFormError(e.message || 'Login failed. Please check your credentials.')
      setStatus('idle')
    }
  }

  useEffect(() => {
    const remembered = localStorage.getItem('remembered_email')
    if (remembered) { setEmail(remembered); setRemember(true) }
  }, [])

  const onKeyDown = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="auth-root">
      <div className="grid-veil" />
      <div className="ambient-ring" />
      <div className="ambient-glow-a" />
      <div className="ambient-glow-b" />

      <button
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        aria-label="Toggle color theme"
        title="Toggle theme"
      >
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>

      <div className="auth-brand">
        <div className="brand-row">
          <div className="brand-logo"><IconSparkle /></div>
          <span className="brand-name">InterviewIQ AI</span>
        </div>
        <div className="brand-tagline">Practice. Improve. Get Hired.</div>
      </div>

      <div className="auth-shell">
        <div className="info-panel">
          <div className="info-eyebrow"><span className="live-dot" />Live AI Interview Practice</div>
          <div className="info-heading">Master Every Interview.<br /><span className="grad-text">Land Your Dream Job.</span></div>
          <div className="info-desc">
            Practice realistic AI-powered interviews that help you build confidence, improve technical
            knowledge, strengthen communication skills, and perform better in real hiring processes.
          </div>

          <div className="stat-strip">
            {STATS.map((s) => <StatItem key={s.label} {...s} />)}
          </div>

          <div className="readiness-card">
            <ReadinessRing percent={82} />
            <div className="readiness-copy">
              <div className="readiness-title">Average Readiness Score</div>
              <div className="readiness-desc">Candidates improve their readiness score by 40% after just three practice sessions.</div>
            </div>
          </div>

          <div className="info-subheading">Prepare for roles like</div>
          <div className="chip-grid">
            {CAREER_CHIPS.map((c) => (
              <div className="chip" key={c.label}>
                <span className="chip-icon">{c.icon}</span>
                {c.label}
              </div>
            ))}
          </div>

          <div className="info-subheading">Trusted prep for interviews at</div>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {doubledCompanies.map((c, i) => <span className="marquee-item" key={`${c}-${i}`}>{c}</span>)}
            </div>
          </div>

          <TestimonialRotator items={TESTIMONIALS} />
        </div>

        <div className="auth-card" role="main">
          <div className="auth-heading">Welcome Back</div>
          <div className="auth-subtitle">Sign in to continue sharpening your interview skills.</div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-email">Email</label>
            <div className="input-wrap">
              <span className="input-icon"><IconMail /></span>
              <input
                id="login-email"
                className={`auth-input${fieldErrors.email ? ' input-error' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input
                id="login-password"
                className={`auth-input has-toggle${fieldErrors.password ? ' input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-personality">Interviewer Personality</label>
            <div className="select-wrap">
              <select id="login-personality" className="auth-select" value={personality} onChange={(e) => setPersonality(e.target.value)}>
                {PERSONALITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-difficulty">Interview Difficulty</label>
            <div className="select-wrap">
              <select id="login-difficulty" className="auth-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-career-goal">Target Role (optional)</label>
            <div className="select-wrap">
              <select id="login-career-goal" className="auth-select" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)}>
                {CAREER_GOALS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-experience">Experience Level (optional)</label>
            <div className="select-wrap">
              <select id="login-experience" className="auth-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                {EXPERIENCE_LEVELS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
              </select>
            </div>
          </div>

          <div className="row-between">
            <label className="remember-check">
              <span
                className={`custom-checkbox${remember ? ' checked' : ''}`}
                onClick={() => setRemember((v) => !v)}
                role="checkbox"
                aria-checked={remember}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setRemember((v) => !v)}
              >
                {remember && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 12l6 6L20 6" /></svg>}
              </span>
              Remember me
            </label>
            <button type="button" className="link-muted" onClick={() => setToast('Password reset flow coming soon.')}>
              Forgot Password?
            </button>
          </div>

          {formError && <div className="field-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{formError}</div>}

          <button
            className={`btn-primary${status === 'success' ? ' btn-success' : ''}`}
            onClick={handleLogin}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' && <span className="spinner" />}
            {status === 'success' && <CheckmarkAnim />}
            {status === 'idle' && <>Log In <IconArrow /></>}
            {status === 'loading' && 'Logging in...'}
            {status === 'success' && 'Success!'}
          </button>

          <div className="auth-divider">OR</div>

          <div className="social-row">
            <button type="button" className="btn-social" onClick={() => setToast('Google sign-in coming soon.')}>
              <IconGoogle /> Continue with Google
            </button>
            <button type="button" className="btn-social" onClick={() => setToast('GitHub sign-in coming soon.')}>
              <IconGithub /> Continue with GitHub
            </button>
            <button type="button" className="btn-social social-linkedin" onClick={() => setToast('LinkedIn sign-in coming soon.')}>
              <IconLinkedIn /> Continue with LinkedIn
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup" className="link-muted">Sign up</Link>
          </div>
        </div>
      </div>

      {toast && <div className="toast-note">{toast}</div>}
    </div>
  )
}