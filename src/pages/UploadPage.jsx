import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { readApiResponse } from '../api.js'
import '../appShell.css'
import '../sidePanel.css'

/* ── Inline icon set (kept consistent with the rest of the app) ────────── */
const IconSparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)
const IconUpload = ({ color = 'var(--grad-cyan)' }) => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" />
    <path d="M4 16.5V19a2 2 0 002 2h12a2 2 0 002-2v-2.5" />
  </svg>
)
const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 15l2 2 4-4" />
  </svg>
)
const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
  </svg>
)
const IconArrow = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const IconCheckSm = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l6 6L20 6" />
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
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
)

const STEPS = [
  { title: 'Upload Resume', text: 'Securely upload your latest resume as a PDF.' },
  { title: 'AI Resume Analysis', text: 'AI reads your skills, projects, and experience.' },
  { title: 'Personalized Interview', text: 'Questions are generated specifically for your profile.' },
  { title: 'AI Feedback', text: 'Receive detailed feedback to improve your performance.' },
]

const TIPS = [
  'Keep your resume updated',
  'Highlight your projects and achievements',
  'Mention technical skills clearly',
  'Include measurable accomplishments',
]

const ROLES = ['Software Engineer', 'AI Engineer', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'UI/UX Designer']

const QUALITY_BADGES = ['ATS Friendly', 'AI Ready', 'Secure Upload', 'Instant Processing']

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
        <div className="side-headline">Your Dream Job Begins With One Upload.</div>
        <div className="side-sub">Upload your resume once and let AI create personalized interview experiences tailored to your skills and goals.</div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.9rem' }}>What Happens Next</div>
        <div className="step-timeline">
          {STEPS.map((s, i) => (
            <div className="step-item" key={s.title}>
              <div className="step-marker">{i + 1}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <div className="step-text">{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.8rem' }}>Resume Tips</div>
        <div className="tip-list">
          {TIPS.map((t) => (
            <div className="tip-item" key={t}>
              <span className="tip-check"><IconCheckSm /></span> {t}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.8rem' }}>Supported Roles</div>
        <div className="role-grid">
          {ROLES.map((r) => <div className="role-card" key={r}>{r}</div>)}
        </div>
      </div>

      <div className="glass-card side-card">
        <div className="app-eyebrow" style={{ marginBottom: '0.8rem' }}>Resume Quality</div>
        <div className="quality-grid">
          {QUALITY_BADGES.map((q) => <span className="quality-badge" key={q}><IconCheckSm /> {q}</span>)}
        </div>
      </div>

      <div className="glass-card side-card privacy-card">
        <div className="privacy-icon"><IconLock /></div>
        <div>
          <div className="privacy-title">Your Privacy Matters</div>
          <div className="privacy-text">Your resume is securely processed and only used to personalize your interview experience.</div>
        </div>
      </div>
    </>
  )
}

const styles = {
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '540px',
    padding: '3rem',
  },
  brandRow: { display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', marginBottom: '2.5rem', fontSize: '1rem' },
  dropzone: {
    border: '2px dashed var(--app-input-border)',
    borderRadius: '20px',
    padding: '2.75rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    background: 'radial-gradient(circle at 50% 0%, rgba(124,108,255,0.05), var(--app-input-bg) 65%)',
    marginBottom: '1.5rem',
  },
  dropzoneHover: {
    border: '2px dashed var(--grad-cyan)',
    background: 'rgba(55, 224, 216, 0.06)',
    transform: 'translateY(-2px)',
  },
  dropText: { color: 'var(--app-text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem', lineHeight: 1.6 },
  fileBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    color: 'var(--accent-success)', fontWeight: 700, marginTop: '1rem', fontSize: '0.9rem',
    background: 'rgba(47, 208, 138, 0.1)', border: '1px solid rgba(47, 208, 138, 0.3)',
    borderRadius: '9999px', padding: '0.4rem 0.9rem',
  },
  error: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    color: 'var(--accent-error)', marginTop: '1rem', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 600,
  },
  loading: { color: 'var(--grad-cyan)', marginTop: '1rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 },
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!sessionStorage.getItem('user_email')) {
      navigate('/')
    }
  }, [])

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Please upload a PDF file.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-resume', { method: 'POST', body: fd })
      const data = await readApiResponse(res, 'Upload failed')
      sessionStorage.setItem('session_id', data.session_id)
      sessionStorage.setItem('skills', JSON.stringify(data.skills))
      navigate('/calibrate')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page premium-type">
      <div className="premium-ambient" aria-hidden="true">
        <span className="p-ring" /><span className="p-glow-a" /><span className="p-glow-b" /><span className="p-grid" />
      </div>
      <div className="particle-field" aria-hidden="true">
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
      </div>

      <div className="split-shell">
        {/* ── Desktop sticky side panel ─────────────────────────────────── */}
        <div className="side-panel-cell">
          <div className="side-panel">
            <SidePanelContent />
          </div>
        </div>

        {/* ── Main upload experience (unchanged functionality) ─────────── */}
        <div className="split-main">
          {/* ── Mobile collapsible panel (above the upload card) ─────────── */}
          <details className="side-collapsible" style={{ width: '100%', maxWidth: '540px' }}>
            <summary>Why Upload Your Resume?</summary>
            <div className="side-collapsible-body">
              <SidePanelContent />
            </div>
          </details>

          <div className="glass-card hoverable fade-slide-up" style={styles.card}>
            <div style={styles.brandRow}>
              <div className="app-brand-row">
                <div className="app-brand-logo"><IconSparkle /></div>
                <span className="app-brand-name" style={{ fontSize: '1.6rem' }}>InterviewIQ AI</span>
              </div>
            </div>
            <div className="app-subtitle" style={styles.subtitle}>
              Upload your resume to begin your AI-powered interview screening.
            </div>

            <div
              style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneHover : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconUpload color={dragging ? 'var(--grad-cyan)' : 'var(--app-text-muted)'} />
              </div>
              <div style={styles.dropText}>
                Drag &amp; drop your PDF resume here<br />or click to browse
              </div>
              {file && (
                <div style={styles.fileBadge}>
                  <IconFile /> {file.name}
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            <button
              className="app-btn-primary"
              style={{ width: '100%' }}
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? (
                <><span className="app-spinner" /> Parsing Resume...</>
              ) : (
                <>Start Interview <IconArrow /></>
              )}
            </button>

            {error && <div style={styles.error}><IconWarning /> {error}</div>}
            {loading && <div style={styles.loading}>Extracting your skills with AI...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}