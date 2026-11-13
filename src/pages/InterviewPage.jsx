import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { readApiResponse } from '../api.js'
import '../appShell.css'
import '../interviewStudio.css'

const API = ''

/* ── Inline icon set ─────────────────────────────────────────────────── */
const IconSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)
const IconMic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0014 0M12 19v3" />
  </svg>
)
const IconType = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V5h16v2M9 19h6M12 5v14" />
  </svg>
)
const IconStop = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </svg>
)
const IconChart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
)
const IconArrow = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
)
const IconCompass = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M15 9l-2 6-6 2 2-6 6-2z" />
  </svg>
)
const IconFace = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8.5 10h.01M15.5 10h.01M8 15c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5" />
  </svg>
)
const IconBody = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.2" />
    <path d="M12 8v6M8 22l4-8 4 8M8 12l-2 3M16 12l2 3" />
  </svg>
)
const IconChair = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4v13M19 4v13M5 15h14M6.5 17l-2 4M17.5 17l2 4" />
  </svg>
)
const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2.5" />
  </svg>
)
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
)
const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="M21 16l-5-5-4 4-3-3-5 5" />
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
)
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)
const IconListChecks = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
  </svg>
)
const IconLayers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5M3 18l9 5 9-5" />
  </svg>
)
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2-5.6-3.4-5.6 3.4 1.4-6.2-4.8-4.3 6.4-.6L12 3z" />
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)
const IconWarningTriangle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
  </svg>
)

/* ── AI Interviewer robot avatar (idle/listening/speaking states) ─────── */
const RobotAvatar = ({ phase, size = 62 }) => {
  const state = phase === 'speaking' ? 'speaking' : 'listening'
  return (
    <div className="robot-avatar-wrap" style={{ width: size, height: size }}>
      <div className={`robot-avatar-glow ${state}`} />
      <svg className={`robot-svg ${state}`} width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="10" r="2.4" className="robot-antenna-dot" />
        <line x1="32" y1="12" x2="32" y2="18" stroke="var(--grad-cyan)" strokeWidth="1.6" />
        <rect x="14" y="18" width="36" height="30" rx="12" fill="url(#robotHeadGradInterview)" stroke="rgba(255,255,255,0.18)" />
        <rect x="20" y="26" width="24" height="14" rx="7" fill="rgba(6,10,26,0.55)" />
        <ellipse className="robot-eye" cx="26.5" cy="33" rx="2.2" ry="3.2" />
        <ellipse className="robot-eye" cx="37.5" cy="33" rx="2.2" ry="3.2" />
        <path d="M22 46c4 3 16 3 20 0" stroke="var(--grad-cyan)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <rect x="8" y="30" width="4" height="10" rx="2" fill="rgba(124,108,255,0.5)" />
        <rect x="52" y="30" width="4" height="10" rx="2" fill="rgba(124,108,255,0.5)" />
        <defs>
          <linearGradient id="robotHeadGradInterview" x1="14" y1="18" x2="50" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#232a55" />
            <stop offset="1" stopColor="#141834" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Maps a correction-warning string to a short title + icon for the
// "Adjust This" contextual popup shown in the right-hand column.
const WARNING_META = [
  { match: 'no face', title: 'Face Detection', Icon: IconFace },
  { match: 'closer', title: 'Camera Distance', Icon: IconCamera },
  { match: 'back from', title: 'Camera Distance', Icon: IconCamera },
  { match: 'slightly left', title: 'Camera Position', Icon: IconCamera },
  { match: 'slightly right', title: 'Camera Position', Icon: IconCamera },
  { match: 'raise', title: 'Camera Position', Icon: IconCamera },
  { match: 'lower', title: 'Camera Position', Icon: IconCamera },
  { match: 'center your head', title: 'Head Position', Icon: IconCompass },
  { match: 'face the camera directly', title: 'Face Orientation', Icon: IconFace },
  { match: 'look at the screen', title: 'Eye Contact', Icon: IconEye },
  { match: 'sit upright', title: 'Posture', Icon: IconChair },
  { match: 'shoulders visible', title: 'Posture', Icon: IconChair },
  { match: 'stay still', title: 'Body Stability', Icon: IconBody },
]
function getWarningMeta(text = '') {
  const lower = text.toLowerCase()
  const hit = WARNING_META.find((w) => lower.includes(w.match))
  return hit || { title: 'Adjust This', Icon: IconWarningTriangle }
}

const micSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

const fmtTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Capture resolution for the webcam feed + MediaPipe processing.
// Bumped up from the old 200x150 so the box shows the full face and
// background clearly instead of a tiny cropped thumbnail.
const CAM_WIDTH = 640
const CAM_HEIGHT = 480

export default function InterviewPage() {
  const navigate = useNavigate()
  const sessionId = sessionStorage.getItem('session_id')
  const skills = JSON.parse(sessionStorage.getItem('skills') || '[]')
  const resumeName = sessionStorage.getItem('resume_name') || ''
  const personality = sessionStorage.getItem('interview_personality') || 'professional'
  const difficulty = sessionStorage.getItem('interview_difficulty') || 'medium'

  const videoRef = useRef(null)
  const faceMeshRef = useRef(null)
  const poseRef = useRef(null)
  const cameraRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const recognitionRef = useRef(null)
  const recordingRef = useRef(false)
  const finalTextRef = useRef('')
  const attachRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  const [question, setQuestion] = useState('')
  const [questionNum, setQuestionNum] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [transcript, setTranscript] = useState('')
  const [recording, setRecording] = useState(false)
  const [gazeShifts, setGazeShifts] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [gazeAlert, setGazeAlert] = useState(false)
  const [tabAlert, setTabAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | speaking | answering | submitting
  const [error, setError] = useState('')
  const [pendingAnswer, setPendingAnswer] = useState('')
  const [typedAnswer, setTypedAnswer] = useState('')
  const [showTypeBox, setShowTypeBox] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [adjustDismissed, setAdjustDismissed] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  // ── Live posture/face monitoring (same 6 checks as the calibration page) ──
  const [liveIndicators, setLiveIndicators] = useState({
    eyeContact: false,
    headPosition: false,
    faceOrientation: false,
    bodyStability: false,
    posture: false,
    cameraAlignment: false,
  })
  const [correctionWarnings, setCorrectionWarnings] = useState([])
  const latestFaceRef = useRef(null)
  const latestPoseRef = useRef(null)
  const shoulderHistoryRef = useRef([])
  const eyeContactCountRef = useRef(0)

  const gazeShiftsRef = useRef(0)
  const tabSwitchesRef = useRef(0)

  // ── Interview timer ───────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Re-show the "Adjust This" popup whenever the set of active warnings
  // changes, so dismissing an old warning doesn't hide a new one.
  useEffect(() => {
    setAdjustDismissed(false)
  }, [correctionWarnings.join('|')])

  // Recomputes the same 6 checks used on the calibration page, from whatever
  // face/pose landmarks were most recently observed, and raises correction
  // warnings if something drifts out of range during the interview.
  const analyzeLiveIndicators = useCallback(() => {
    const face = latestFaceRef.current
    const pose = latestPoseRef.current
    setFaceDetected(!!face)
    const nextWarnings = []
    const next = {
      eyeContact: false,
      headPosition: false,
      faceOrientation: false,
      bodyStability: false,
      posture: false,
      cameraAlignment: false,
    }

    if (!face) {
      nextWarnings.push('No face detected — please face the camera.')
      eyeContactCountRef.current = 0
    } else {
      const xs = face.map((p) => p.x)
      const ys = face.map((p) => p.y)
      const minX = Math.min(...xs), maxX = Math.max(...xs)
      const minY = Math.min(...ys), maxY = Math.max(...ys)
      const boxW = maxX - minX
      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2

      const centered = centerX > 0.32 && centerX < 0.68 && centerY > 0.25 && centerY < 0.75
      const goodSize = boxW > 0.22 && boxW < 0.68
      next.cameraAlignment = centered && goodSize
      if (boxW <= 0.22) nextWarnings.push('Move closer to the camera.')
      if (boxW >= 0.68) nextWarnings.push('Move back from the camera.')
      if (centerX <= 0.32) nextWarnings.push('Move slightly left.')
      if (centerX >= 0.68) nextWarnings.push('Move slightly right.')
      if (centerY <= 0.25) nextWarnings.push('Raise your camera.')
      if (centerY >= 0.75) nextWarnings.push('Lower your camera.')

      const nose = face[1]
      next.headPosition = nose && nose.x > 0.35 && nose.x < 0.65 && nose.y > 0.3 && nose.y < 0.7
      if (nose && !next.headPosition) nextWarnings.push('Center your head in the frame.')

      const leftCheek = face[234]
      const rightCheek = face[454]
      if (nose && leftCheek && rightCheek) {
        const dLeft = Math.hypot(nose.x - leftCheek.x, nose.y - leftCheek.y)
        const dRight = Math.hypot(nose.x - rightCheek.x, nose.y - rightCheek.y)
        const ratio = dLeft / (dRight || 0.0001)
        next.faceOrientation = ratio > 0.72 && ratio < 1.38
        if (!next.faceOrientation) nextWarnings.push('Face the camera directly.')
      }

      const iris = face[468]
      const innerCorner = face[33]
      const outerCorner = face[133]
      if (iris && innerCorner && outerCorner) {
        const eyeMinX = Math.min(innerCorner.x, outerCorner.x)
        const eyeMaxX = Math.max(innerCorner.x, outerCorner.x)
        const eyeWidth = eyeMaxX - eyeMinX
        if (eyeWidth > 0.001) {
          const offset = (iris.x - eyeMinX) / eyeWidth
          const looking = offset > 0.3 && offset < 0.7
          eyeContactCountRef.current = looking
            ? Math.min(15, eyeContactCountRef.current + 1)
            : Math.max(0, eyeContactCountRef.current - 1)
          next.eyeContact = eyeContactCountRef.current >= 8
          if (!next.eyeContact) nextWarnings.push('Look at the screen/camera.')
        }
      }
    }

    if (!pose) {
      nextWarnings.push('Keep your shoulders visible.')
    } else {
      const ls = pose[11]
      const rs = pose[12]
      const shouldersVisible = ls && rs && (ls.visibility ?? 1) > 0.5 && (rs.visibility ?? 1) > 0.5
      if (!shouldersVisible) {
        nextWarnings.push('Keep your shoulders visible.')
      } else {
        const levelness = Math.abs(ls.y - rs.y)
        next.posture = levelness < 0.06
        if (!next.posture) nextWarnings.push('Sit upright.')

        const midX = (ls.x + rs.x) / 2
        const midY = (ls.y + rs.y) / 2
        const hist = shoulderHistoryRef.current
        hist.push({ x: midX, y: midY })
        if (hist.length > 20) hist.shift()
        if (hist.length >= 8) {
          const xs2 = hist.map((p) => p.x)
          const ys2 = hist.map((p) => p.y)
          const rangeX = Math.max(...xs2) - Math.min(...xs2)
          const rangeY = Math.max(...ys2) - Math.min(...ys2)
          next.bodyStability = rangeX < 0.035 && rangeY < 0.035
          if (!next.bodyStability) nextWarnings.push('Try to stay still — minimize movement.')
        }
      }
    }

    setLiveIndicators(next)
    setCorrectionWarnings([...new Set(nextWarnings)].slice(0, 3))

    // Lightweight overlay: face oval + eyes + shoulder line, drawn over the webcam feed.
    const canvas = overlayCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      if (face) {
        ctx.fillStyle = '#4ade80'
        ;[33, 133, 468, 362, 263, 473, 1].forEach((idx) => {
          const p = face[idx]
          if (!p) return
          ctx.beginPath()
          ctx.arc(p.x * w, p.y * h, 3, 0, Math.PI * 2)
          ctx.fill()
        })
      }
      if (pose) {
        const ls = pose[11], rs = pose[12]
        if (ls && rs && (ls.visibility ?? 1) > 0.4 && (rs.visibility ?? 1) > 0.4) {
          ctx.strokeStyle = 'rgba(74,222,128,0.85)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(ls.x * w, ls.y * h)
          ctx.lineTo(rs.x * w, rs.y * h)
          ctx.stroke()
        }
      }
    }
  }, [])

  // ── Tab-switch detection ─────────────────────────────────────────────────
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchesRef.current += 1
        setTabSwitches(tabSwitchesRef.current)
        setTabAlert(true)
        updateProctoring()
        setTimeout(() => setTabAlert(false), 3000)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  // ── Camera + MediaPipe Face Mesh ─────────────────────────────────────────
  useEffect(() => {
    let cleanup = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: CAM_WIDTH },
            height: { ideal: CAM_HEIGHT },
            facingMode: 'user',
          },
          audio: false,
        })
        if (videoRef.current) videoRef.current.srcObject = stream
        initFaceMesh()
      } catch (e) {
        console.error('Camera error:', e)
      }
    }

    function initFaceMesh() {
      if (!window.FaceMesh) {
        setTimeout(initFaceMesh, 800)
        return
      }
      const faceMesh = new window.FaceMesh({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
      })
      faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })

      // Edge-triggered gaze-shift counter. Rather than a flat cooldown timer
      // (which either misses rapid natural glances or double-counts a single
      // sustained look-away), this tracks whether the user is CURRENTLY away
      // and only increments on the away transition — one shift per look-away,
      // counted the instant it's confirmed, ready to count the very next one
      // as soon as they return and look away again.
      let awayState = false
      let awayFrames = 0
      let clearFrames = 0
      let noFaceFrames = 0
      // ~3 consecutive frames (~100ms @30fps) — fast enough to catch a quick
      // glance, but filters single-frame landmark jitter/noise.
      const ENTER_FRAMES = 3
      const EXIT_FRAMES = 2
      const NO_FACE_ENTER_FRAMES = 4

      const registerAway = (isAway) => {
        if (isAway) {
          clearFrames = 0
          awayFrames += 1
          if (!awayState && awayFrames >= ENTER_FRAMES) {
            awayState = true
            gazeShiftsRef.current += 1
            setGazeShifts(gazeShiftsRef.current)
            setGazeAlert(true)
            updateProctoring()
            setTimeout(() => setGazeAlert(false), 1400)
          }
        } else {
          awayFrames = 0
          clearFrames += 1
          if (awayState && clearFrames >= EXIT_FRAMES) awayState = false
        }
      }

      // Iris offset within the eye socket, both horizontal (left/right) and
      // vertical (up/down), normalized 0..1 so it works regardless of head
      // size/distance from camera.
      let lm_ = null
      const readEye = (irisIdx, cornerAIdx, cornerBIdx, topIdx, bottomIdx) => {
        const iris = lm_[irisIdx], a = lm_[cornerAIdx], b = lm_[cornerBIdx], top = lm_[topIdx], bottom = lm_[bottomIdx]
        if (!iris || !a || !b || !top || !bottom) return null
        const width = Math.abs(a.x - b.x)
        const height = Math.abs(bottom.y - top.y)
        if (width < 0.001 || height < 0.001) return null
        return { h: (iris.x - Math.min(a.x, b.x)) / width, v: (iris.y - top.y) / height }
      }

      faceMesh.onResults((results) => {
        if (cleanup) return
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          latestFaceRef.current = null
          noFaceFrames += 1
          analyzeLiveIndicators()
          // Face partially/fully out of frame — treated as a gaze shift once
          // it's held for a few frames (so a single dropped frame doesn't
          // falsely trigger it).
          registerAway(noFaceFrames >= NO_FACE_ENTER_FRAMES)
          return
        }
        noFaceFrames = 0
        const lm = results.multiFaceLandmarks[0]
        lm_ = lm
        latestFaceRef.current = lm
        analyzeLiveIndicators()

        const left = readEye(468, 33, 133, 159, 145)
        const right = readEye(473, 362, 263, 386, 374)
        const samples = [left, right].filter(Boolean)
        if (samples.length === 0) return
        const hAvg = samples.reduce((s, p) => s + p.h, 0) / samples.length
        const vAvg = samples.reduce((s, p) => s + p.v, 0) / samples.length

        // Tight band around center so smaller, natural eye movements away
        // from the screen are caught — not just exaggerated head turns.
        const lookingAway = hAvg < 0.32 || hAvg > 0.68 || vAvg < 0.30 || vAvg > 0.74
        registerAway(lookingAway)
      })

      faceMeshRef.current = faceMesh

      let pose = null
      if (window.Pose) {
        pose = new window.Pose({
          locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
        })
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
        pose.onResults((results) => {
          if (cleanup) return
          latestPoseRef.current = results.poseLandmarks || null
          analyzeLiveIndicators()
        })
        poseRef.current = pose
      }

      const cam = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (!videoRef.current) return
          await faceMesh.send({ image: videoRef.current })
          if (pose) await pose.send({ image: videoRef.current })
        },
        width: CAM_WIDTH,
        height: CAM_HEIGHT,
      })
      cam.start()
      cameraRef.current = cam
    }

    startCamera()
    return () => {
      cleanup = true
      if (cameraRef.current) cameraRef.current.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Speech recognition: pre-warmed & persistent for the whole interview ──
  // Constructing + starting a brand-new SpeechRecognition instance on every
  // click (the previous behavior) pays the engine's full network/audio
  // init handshake each time — that startup latency is exactly why the
  // first sentence was getting missed. Instead, the engine is created and
  // started once, up front, and just keeps running for the whole session;
  // "Start/Stop Recording" only toggles whether incoming results are
  // captured (via recordingRef), so by the time the user clicks Start the
  // mic is already hot and transcribing immediately. If the browser ends
  // the session on its own (most engines cap a continuous session at
  // ~60s), it's transparently restarted so the mic never goes cold.
  useEffect(() => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionApi) {
      setError('Speech recognition not supported in this browser. Please use Chrome.')
      return
    }

    let stopped = false

    const attach = (recognition) => {
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        if (!recordingRef.current) return
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTextRef.current += event.results[i][0].transcript + ' '
          } else {
            interim += event.results[i][0].transcript
          }
        }
        setTranscript(finalTextRef.current + interim)
        setPendingAnswer(finalTextRef.current.trim())
      }
      recognition.onerror = (e) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') setError('Mic error: ' + e.error)
      }
      recognition.onend = () => {
        // Browsers periodically end a long continuous session on their
        // own — silently re-arm so listening never actually stops.
        if (stopped) return
        try {
          const fresh = new SpeechRecognitionApi()
          attach(fresh)
          fresh.start()
          recognitionRef.current = fresh
        } catch (e) { /* ignore — will retry on next mount/interaction */ }
      }
    }
    attachRef.current = attach

    try {
      const recognition = new SpeechRecognitionApi()
      attach(recognition)
      recognition.start()
      recognitionRef.current = recognition
    } catch (e) { /* mic permission not yet granted — Start Recording will surface the error */ }

    return () => {
      stopped = true
      attachRef.current = null
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  // ── Update proctoring on backend ─────────────────────────────────────────
  const updateProctoring = useCallback(async () => {
    if (!sessionId) return
    try {
      await fetch(`${API}/api/update-proctoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          gaze_shifts: gazeShiftsRef.current,
          tab_switches: tabSwitchesRef.current,
        }),
      })
    } catch (e) { /* ignore */ }
  }, [sessionId])

  // ── TTS: speak question ──────────────────────────────────────────────────
  const speakText = (text) => {
    return new Promise((resolve) => {
      synthRef.current.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = 0.95
      utter.pitch = 1
      utter.onend = resolve
      utter.onerror = resolve
      synthRef.current.speak(utter)
    })
  }

  // ── STT: record answer ───────────────────────────────────────────────────
  const startRecording = () => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionApi) {
      setError('Speech recognition not supported in this browser. Please use Chrome.')
      return
    }
    finalTextRef.current = ''
    setTranscript('')
    setPendingAnswer('')
    recordingRef.current = true
    // The engine is already running (pre-warmed on mount) — if it isn't,
    // for any reason (e.g. it errored out before the user granted mic
    // permission), start it now using the same configuration/handlers.
    if (!recognitionRef.current && attachRef.current) {
      try {
        const recognition = new SpeechRecognitionApi()
        attachRef.current(recognition)
        recognition.start()
        recognitionRef.current = recognition
      } catch (e) { /* ignore */ }
    }
    setRecording(true)
    setPhase('answering')
  }

  const stopRecording = () => {
    // Keep the underlying engine running (see the pre-warm effect above) —
    // only stop capturing into the visible transcript/answer.
    recordingRef.current = false
    setRecording(false)
  }

  // ── Fetch next question ──────────────────────────────────────────────────
  const fetchNextQuestion = useCallback(async (answer = '') => {
    if (!sessionId) return
    setLoading(true)
    setError('')
    setTranscript('')
    setPendingAnswer('')

    try {
      const res = await fetch(`${API}/api/next-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answer, personality, difficulty }),
      })
      const data = await readApiResponse(res, 'Failed to fetch question.')

      if (data.done) {
        await updateProctoring()
        navigate('/result')
        return
      }

      setQuestion(data.question)
      setQuestionNum(data.question_number)
      if (data.total_questions) setTotalQuestions(data.total_questions)
      setLoading(false)
      setPhase('speaking')

      if (data.question_number === 1) {
        const skillsText = skills.length ? skills.slice(0, 5).join(', ') : 'your listed skills'
        const greeting = resumeName
          ? `Hello ${resumeName}! I can see from your resume that you have experience with ${skillsText}. Let's begin.`
          : `Hello! I can see from your resume that you have experience with ${skillsText}. Let's begin.`
        await speakText(greeting)
      }

      await speakText(`Question ${data.question_number}. ${data.question}`)
      setPhase('idle')
    } catch (e) {
      setError('Failed to fetch question: ' + e.message)
      setLoading(false)
    }
  }, [sessionId, navigate, updateProctoring, personality, difficulty])

  // ── Submit answer and get next ───────────────────────────────────────────
  const submitAndNext = async () => {
    stopRecording()
    const answer = [transcript, typedAnswer].filter(Boolean).join(' ').trim() || '(No answer provided)'
    setPhase('submitting')

    try {
      await fetch(`${API}/api/submit-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answer }),
      })
    } catch (e) { /* ignore */ }

    await fetchNextQuestion(answer)
  }

  // ── Skip remaining questions, go straight to evaluation ──────────────────
  const submitAndEvaluate = async () => {
    stopRecording()
    const answer = [transcript, typedAnswer].filter(Boolean).join(' ').trim() || '(No answer provided)'
    setPhase('submitting')

    try {
      await fetch(`${API}/api/submit-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answer }),
      })
    } catch (e) { /* ignore */ }

    await updateProctoring()
    navigate('/result')
  }

  // ── Init: get first question ─────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) { navigate('/'); return }
    fetchNextQuestion('')
  }, [])

  // ── Derived / display values ─────────────────────────────────────────────
  const qualityScore = Math.max(0, Math.min(100, 100 - gazeShifts * 4 - tabSwitches * 8))
  const primaryWarning = correctionWarnings[0]
  const warningMeta = getWarningMeta(primaryWarning)
  const WarnIcon = warningMeta.Icon

  const liveRows = [
    { key: 'eyeContact', label: 'Eye Contact', Icon: IconEye, ok: liveIndicators.eyeContact },
    { key: 'headPosition', label: 'Head Position', Icon: IconCompass, ok: liveIndicators.headPosition },
    { key: 'faceOrientation', label: 'Face Orientation', Icon: IconFace, ok: liveIndicators.faceOrientation },
    { key: 'bodyStability', label: 'Body Stability', Icon: IconBody, ok: liveIndicators.bodyStability },
    { key: 'posture', label: 'Posture', Icon: IconChair, ok: liveIndicators.posture },
    { key: 'cameraAlignment', label: 'Camera Alignment', Icon: IconCamera, ok: liveIndicators.cameraAlignment },
    { key: 'microphone', label: 'Microphone', Icon: IconMic, ok: micSupported },
    { key: 'lighting', label: 'Lighting', Icon: IconSun, ok: faceDetected },
    { key: 'background', label: 'Background', Icon: IconImage, ok: liveIndicators.cameraAlignment },
  ]

  // ── Styles ───────────────────────────────────────────────────────────────
  const s = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: {
      position: 'relative', zIndex: 1,
      borderBottom: '1px solid var(--app-divider)',
      padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1rem',
      background: 'rgba(9, 11, 26, 0.5)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    headerCenter: { flex: 1, minWidth: '200px', maxWidth: '380px' },
    headerMeta: { color: 'var(--app-text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' },
    shell: { position: 'relative', zIndex: 1, flex: 1, padding: '1.5rem 2rem 2.5rem', margin: '0 auto' },
    videoWrap: { width: '100%', maxWidth: '380px', aspectRatio: '4 / 3', margin: '0 auto' },
    transcriptBox: {
      background: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', borderRadius: '13px',
      padding: '1rem', minHeight: '80px', color: 'var(--app-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5,
    },
    typeArea: {
      width: '100%', minHeight: '80px', background: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)',
      borderRadius: '13px', padding: '0.8rem', color: 'var(--app-text-primary)', fontSize: '0.95rem',
      fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box',
    },
    controls: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
    loading: { color: 'var(--grad-cyan)', textAlign: 'center', padding: '2rem', fontWeight: 600 },
    error: { color: 'var(--accent-error)', textAlign: 'center', fontWeight: 600 },
  }

  return (
    <div className="app-page" style={s.page}>
      <div className="particle-field" aria-hidden="true">
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
      </div>

      {/* Header */}
      <div style={s.header}>
        <div className="app-brand-row">
          <div className={`ai-pulse-ring${phase === 'speaking' ? ' active' : ''}`}>
            <div className="app-brand-logo" style={{ width: 32, height: 32 }}><IconSparkle /></div>
          </div>
          <span className="app-brand-name" style={{ fontSize: '1.1rem' }}>InterviewIQ AI</span>
        </div>

        <div style={s.headerCenter}>
          <div style={s.headerMeta}>Question {questionNum} / {totalQuestions}</div>
          <div className="progress-track" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: `${totalQuestions ? (questionNum / totalQuestions) * 100 : 0}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
          <span className="chip" style={{ textTransform: 'capitalize' }}>{personality} · {difficulty}</span>
          <span style={{ ...s.headerMeta, marginBottom: 0 }}>Session: {sessionId?.slice(0, 8)}</span>
        </div>
      </div>

      {/* Main 3-column studio (mirrors the Calibration page layout) */}
      <div className="calib-shell" style={s.shell}>

        {/* Left: AI Interviewer + Live Monitoring + Privacy */}
        <div className="studio-side-cell">
        <div className="studio-side-col" style={{ gap: '1rem' }}>
          <div className="glass-card robot-card fade-slide-up">
            <div className="robot-card-header">
              <span className="app-eyebrow" style={{ fontSize: '0.68rem' }}>AI Interviewer</span>
              <span className="studio-live-badge"><span className="studio-live-dot" /> LIVE</span>
            </div>
            <div className="robot-stage">
              <RobotAvatar phase={phase} />
              <div className="robot-bubble">
                <div className="robot-bubble-name">Hello! I'm your AI Interviewer 🤖</div>
                <div className="robot-bubble-text">
                  I'll be asking you a series of questions. Think out loud and explain your thoughts clearly.
                </div>
                <div className={`robot-state-pill${phase === 'speaking' ? ' speaking' : ' listening'}`}>
                  ● {phase === 'speaking' ? 'Speaking' : 'Listening'}
                </div>
              </div>
            </div>
            <div className={`waveform${phase === 'speaking' ? '' : ' idle'}`} aria-hidden="true">
              <span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.1rem' }}>
            <div className="app-eyebrow" style={{ marginBottom: '0.75rem' }}>Live Monitoring</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {liveRows.map(({ key, label, Icon, ok }) => (
                <div key={key} className={`mon-row${ok ? ' ok' : ' warn'}`}>
                  <span className="mon-label"><Icon /> {label}</span>
                  <span className="mon-state">{ok ? 'Good' : 'Adjust'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card privacy-card" style={{ padding: '1.1rem' }}>
            <div className="privacy-icon"><IconLock /></div>
            <div>
              <div className="privacy-title">Your Privacy Matters</div>
              <div className="privacy-text">Your data is secure, encrypted and never shared with anyone.</div>
            </div>
          </div>
        </div>
        </div>

        {/* Center: webcam + question card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minWidth: 0 }}>
          <div className="studio-cam-frame glass-card pulse-glow" style={s.videoWrap}>
            <div className="studio-badge-row">
              <span className="studio-live-badge"><span className="studio-live-dot" /> LIVE</span>
              <span className="studio-hd-badge">1080p HD</span>
            </div>
            <video ref={videoRef} autoPlay muted playsInline className="studio-cam-video" />
            <canvas ref={overlayCanvasRef} width={CAM_WIDTH} height={CAM_HEIGHT} className="studio-cam-canvas" />
            <div className="scan-line-wrap"><div className="scan-line" /></div>
            <div className="studio-cam-footer">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="dot-ok" /> Make sure your face is clearly visible
              </span>
              <span className="studio-signal-bars"><span /><span /><span /></span>
            </div>
          </div>

          {(gazeAlert || tabAlert) && (
            <div className="warning-pill" style={{ textAlign: 'center' }}>
              {gazeAlert ? '🚨 Gaze shifted! ' : ''}{tabAlert ? '⚠ Tab switched!' : ''}
            </div>
          )}

          {loading ? (
            <div className="glass-card" style={s.loading}>
              {phase === 'submitting' ? 'Submitting answer...' : 'Loading question...'}
            </div>
          ) : error ? (
            <div className="glass-card" style={{ padding: '1.5rem', ...s.error }}>⚠ {error}</div>
          ) : (
            <div className="glass-card q-card-premium fade-slide-up">
              <span className="batch-pill">
                Batch {Math.ceil(questionNum / 5) || 1} of {Math.ceil(totalQuestions / 5)}
              </span>

              <div className="progress-dot-track">
                {[1, 2, 3, 4, 5].map((n) => {
                  const posInBatch = ((questionNum - 1) % 5) + 1
                  return <div key={n} className={`seg${n === posInBatch ? ' active' : n < posInBatch ? ' done' : ''}`} />
                })}
              </div>

              <div className="q-meta-row">
                <span className="app-eyebrow">Question {questionNum} of {totalQuestions}</span>
                <span className="chip" style={{ textTransform: 'capitalize' }}>{difficulty}</span>
              </div>
              <div className="q-text-premium">{question}</div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.85rem' }}>Your Answer (spoken):</div>
                <div className={`waveform${recording ? '' : ' idle'}`} aria-hidden="true">
                  <span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" />
                </div>
              </div>
              <div style={s.transcriptBox}>
                {transcript || (recording ? '🎙 Listening...' : 'Click "Start Recording" and speak your answer.')}
              </div>

              {showTypeBox && (
                <div>
                  <div style={{ color: 'var(--app-text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Or type your answer:</div>
                  <textarea
                    style={s.typeArea}
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              )}

              <div className="bottom-actions-row" style={s.controls}>
                <button
                  className={recording ? 'app-btn-danger' : 'app-btn-secondary active'}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => recording ? stopRecording() : startRecording()}
                  disabled={phase === 'speaking' || phase === 'submitting'}
                >
                  {recording ? <><IconStop /> Stop Recording</> : <><IconMic /> Start Recording</>}
                </button>
                <button
                  className={`app-btn-secondary${showTypeBox ? ' active' : ''}`}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => setShowTypeBox((v) => !v)}
                  disabled={phase === 'speaking' || phase === 'submitting'}
                >
                  <IconType /> {showTypeBox ? 'Hide Typing' : 'Type Answer'}
                </button>
              </div>

              <div className="bottom-actions-row" style={s.controls}>
                <button
                  className="app-btn-primary"
                  style={{ flex: 1 }}
                  onClick={submitAndNext}
                  disabled={phase === 'submitting'}
                >
                  {questionNum < totalQuestions ? <>Next Question <IconArrow /></> : <>Submit &amp; Finish <IconArrow /></>}
                </button>
                <button
                  className="app-btn-evaluate"
                  style={{ flex: 1 }}
                  onClick={submitAndEvaluate}
                  disabled={phase === 'submitting'}
                >
                  <span className="eval-btn-icon"><IconChart /></span>
                  <span className="eval-btn-copy">
                    <span className="eval-btn-title">Get Evaluation Score</span>
                    <span className="eval-btn-sub">Ends the interview</span>
                  </span>
                </button>
              </div>

              {phase === 'speaking' && (
                <div style={{ color: 'var(--grad-cyan)', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                  🔊 AI interviewer is reading the question...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Adjust This popup + stats */}
        <div className="studio-side-cell">
        <div className="studio-side-col" style={{ gap: '1rem' }}>
          {primaryWarning && !adjustDismissed && (
            <div className="glass-card adjust-popup fade-slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.7rem' }}>
                  <div className="adjust-popup-icon"><WarnIcon /></div>
                  <div>
                    <div className="adjust-popup-heading">{warningMeta.title}</div>
                    <div className="adjust-popup-desc">{primaryWarning}</div>
                  </div>
                </div>
                <button className="adjust-popup-close" onClick={() => setAdjustDismissed(true)} aria-label="Dismiss">
                  <IconX />
                </button>
              </div>
            </div>
          )}

          <div className="glass-card fade-slide-up" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="stat-mini-card">
              <div className="stat-mini-icon"><IconClock /></div>
              <div>
                <div className="stat-mini-label">Time Elapsed</div>
                <div className="stat-mini-value">{fmtTime(elapsedSeconds)}</div>
              </div>
            </div>
            <div className="stat-mini-card">
              <div className="stat-mini-icon"><IconListChecks /></div>
              <div>
                <div className="stat-mini-label">Questions Left</div>
                <div className="stat-mini-value">{Math.max(0, totalQuestions - questionNum + 1)} / {totalQuestions}</div>
              </div>
            </div>
            <div className="stat-mini-card">
              <div className="stat-mini-icon"><IconLayers /></div>
              <div>
                <div className="stat-mini-label">Current Section</div>
                <div className="stat-mini-value" style={{ textTransform: 'capitalize' }}>{difficulty}</div>
              </div>
            </div>
            <div className="stat-mini-card">
              <div className="stat-mini-icon"><IconStar /></div>
              <div>
                <div className="stat-mini-label">Quality Score</div>
                <div className="stat-mini-value" style={{ color: 'var(--accent-success)' }}>{qualityScore}%</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.1rem' }}>
            <div className="app-eyebrow" style={{ marginBottom: '0.7rem' }}>Your Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.slice(0, 8).map((sk, i) => (
                <span key={i} className="chip">{sk}</span>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div className="app-eyebrow" style={{ marginBottom: '0.2rem' }}>Proctoring Log</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--app-text-secondary)' }}>Gaze shifts</span>
              <span style={{ fontWeight: 700, color: gazeShifts > 3 ? 'var(--accent-error)' : 'var(--accent-success)' }}>{gazeShifts}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--app-text-secondary)' }}>Tab switches</span>
              <span style={{ fontWeight: 700, color: tabSwitches > 0 ? 'var(--accent-error)' : 'var(--accent-success)' }}>{tabSwitches}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--app-text-secondary)' }}>Phase</span>
              <span style={{ fontWeight: 700, fontSize: '0.72rem', color: 'var(--grad-cyan)' }}>{phase.toUpperCase()}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}