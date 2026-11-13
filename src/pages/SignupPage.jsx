import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { readApiResponse } from '../api.js'
import '../authStyles.css'

/* ── Inline icon set (kept identical to LoginPage.jsx for consistency) ─── */
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
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.8 4.4-5.8 7.5-5.8s6.1 2 7.5 5.8" />
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

/* Feature-panel icons */
const IconBot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V4M9 4h6" /><circle cx="9" cy="13.5" r="1.2" fill="#fff" stroke="none" /><circle cx="15" cy="13.5" r="1.2" fill="#fff" stroke="none" />
  </svg>
)
const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M11 20V4M18 20v-7" />
  </svg>
)
const IconMic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" />
  </svg>
)
const IconBulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0012 3z" />
  </svg>
)
const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M8 7.5V6a2 2 0 012-2h4a2 2 0 012 2v1.5M3 12.5h18" />
  </svg>
)
const IconTrend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" />
  </svg>
)

const BENEFITS = [
  { icon: <IconBot />, title: 'Personalized Practice', desc: 'Interviews tailored to your resume and target role.' },
  { icon: <IconBulb />, title: 'AI-Powered Feedback', desc: 'Know exactly what to improve after every answer.' },
  { icon: <IconTrend />, title: 'Track Your Growth', desc: 'Watch your readiness score climb over time.' },
  { icon: <IconMic />, title: 'Improve Communication', desc: 'Speak your answers naturally, just like the real thing.' },
  { icon: <IconChart />, title: 'Adaptive Difficulty', desc: 'Questions that get sharper as you get better.' },
  { icon: <IconBriefcase />, title: 'Interview Confidence', desc: 'Walk into real interviews already warmed up.' },
]

const JOURNEY = [
  'Create Your Account',
  'Upload Your Resume',
  'Practice AI Interviews',
  'Receive AI Feedback',
  'Improve Your Skills',
  'Become Job Ready',
]

const TESTIMONIAL = { quote: 'I went from dreading interviews to actually looking forward to them. The feedback was brutally honest in the best way.', author: 'AI Engineer, hired at a Series B startup' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: 'Very Weak', color: '#ff6b7a' },
    { label: 'Weak', color: '#ff8a5c' },
    { label: 'Fair', color: '#f5c542' },
    { label: 'Good', color: '#37e0d8' },
    { label: 'Strong', color: '#2fd08a' },
    { label: 'Very Strong', color: '#2fd08a' },
  ]
  const clamped = Math.min(score, 5)
  return { score: clamped, ...levels[clamped] }
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState('dark')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-auththeme', theme)
    return () => document.documentElement.removeAttribute('data-auththeme')
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const strength = getPasswordStrength(password)

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match.'
    if (!agreedToTerms) errs.terms = 'You must agree to the Terms & Conditions.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSignup = async () => {
    setFormError('')
    if (!validate() || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })
      const data = await readApiResponse(res, 'Signup failed')
      sessionStorage.setItem('user_name', data.user.name)
      sessionStorage.setItem('user_email', data.user.email)
      setStatus('success')
      setTimeout(() => navigate('/upload'), 900)
    } catch (e) {
      setFormError(e.message || 'Signup failed. Please try again.')
      setStatus('idle')
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter') handleSignup() }

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
          <div className="info-eyebrow"><span className="live-dot" />Start Your Prep Journey</div>
          <div className="info-heading">Turn Practice Into<br /><span className="grad-text">Job Offers.</span></div>
          <div className="info-desc">
            Join thousands of candidates building interview confidence, sharpening technical knowledge,
            and getting ready for the roles they actually want.
          </div>

          <div className="info-subheading">Why join InterviewIQ AI</div>
          <div className="feature-grid">
            {BENEFITS.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="info-subheading">Your journey</div>
          <div className="journey-list">
            {JOURNEY.map((step, i) => (
              <div className="journey-step" key={step}>
                <span className="journey-num mono">{i + 1}</span>
                <span className="journey-title">{step}</span>
              </div>
            ))}
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <div className="testimonial-quote">&ldquo;{TESTIMONIAL.quote}&rdquo;</div>
            <div className="testimonial-author">— {TESTIMONIAL.author}</div>
          </div>
        </div>

        <div className="auth-card" role="main">
          <div className="auth-heading">Create Your Account</div>
          <div className="auth-subtitle">Start practicing with an AI interviewer built for you.</div>

          <div className="field-group">
            <label className="field-label" htmlFor="signup-name">Full Name</label>
            <div className="input-wrap">
              <span className="input-icon"><IconUser /></span>
              <input
                id="signup-name"
                className={`auth-input${fieldErrors.name ? ' input-error' : ''}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="signup-email">Email</label>
            <div className="input-wrap">
              <span className="input-icon"><IconMail /></span>
              <input
                id="signup-email"
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
            <label className="field-label" htmlFor="signup-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input
                id="signup-password"
                className={`auth-input has-toggle${fieldErrors.password ? ' input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {password && (
              <div className="strength-meter">
                <div className="strength-track">
                  <div className="strength-fill" style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }} />
                </div>
                <div className="strength-label" style={{ color: strength.color }}>{strength.label}</div>
              </div>
            )}
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="signup-confirm">Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input
                id="signup-confirm"
                className={`auth-input has-toggle${fieldErrors.confirmPassword ? ' input-error' : ''}`}
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
          </div>

          <label className="terms-row">
            <span
              className={`custom-checkbox${agreedToTerms ? ' checked' : ''}`}
              onClick={() => setAgreedToTerms((v) => !v)}
              role="checkbox"
              aria-checked={agreedToTerms}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setAgreedToTerms((v) => !v)}
            >
              {agreedToTerms && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 12l6 6L20 6" /></svg>}
            </span>
            <span onClick={() => setAgreedToTerms((v) => !v)}>
              I agree to the <span className="link-muted" style={{ display: 'inline' }}>Terms &amp; Conditions</span> and Privacy Policy.
            </span>
          </label>
          {fieldErrors.terms && <div className="field-error" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>{fieldErrors.terms}</div>}

          {formError && <div className="field-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{formError}</div>}

          <button
            className={`btn-primary${status === 'success' ? ' btn-success' : ''}`}
            onClick={handleSignup}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' && <span className="spinner" />}
            {status === 'success' && <CheckmarkAnim />}
            {status === 'idle' && <>Create Account <IconArrow /></>}
            {status === 'loading' && 'Creating account...'}
            {status === 'success' && 'Success!'}
          </button>

          <div className="auth-divider">OR</div>

          <div className="social-row">
            <button type="button" className="btn-social" onClick={() => setToast('Google sign-up coming soon.')}>
              <IconGoogle /> Continue with Google
            </button>
            <button type="button" className="btn-social" onClick={() => setToast('GitHub sign-up coming soon.')}>
              <IconGithub /> Continue with GitHub
            </button>
            <button type="button" className="btn-social social-linkedin" onClick={() => setToast('LinkedIn sign-up coming soon.')}>
              <IconLinkedIn /> Continue with LinkedIn
            </button>
          </div>

          <div className="auth-footer">
            Already have an account? <Link to="/" className="link-muted">Log in</Link>
          </div>
        </div>
      </div>

      {toast && <div className="toast-note">{toast}</div>}
    </div>
  )
}