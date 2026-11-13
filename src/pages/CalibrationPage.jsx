import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../appShell.css'
import '../interviewStudio.css'

/* ── Inline icon set ─────────────────────────────────────────────────── */
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
const IconMic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0014 0M12 19v3" />
  </svg>
)
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l6 6L20 6" />
  </svg>
)
const IconCheckSm = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l6 6L20 6" />
  </svg>
)
const IconArrow = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const IconSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)
const IconBulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z" />
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
)

/* ── AI Interview Coach robot avatar (idle/listening breathing state) ─── */
const RobotAvatar = ({ size = 62 }) => (
  <div className="robot-avatar-wrap" style={{ width: size, height: size }}>
    <div className="robot-avatar-glow listening" />
    <svg className="robot-svg listening" width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="10" r="2.4" className="robot-antenna-dot" />
      <line x1="32" y1="12" x2="32" y2="18" stroke="var(--grad-cyan)" strokeWidth="1.6" />
      <rect x="14" y="18" width="36" height="30" rx="12" fill="url(#robotHeadGrad)" stroke="rgba(255,255,255,0.18)" />
      <rect x="20" y="26" width="24" height="14" rx="7" fill="rgba(6,10,26,0.55)" />
      <ellipse className="robot-eye" cx="26.5" cy="33" rx="2.2" ry="3.2" />
      <ellipse className="robot-eye" cx="37.5" cy="33" rx="2.2" ry="3.2" />
      <path d="M22 46c4 3 16 3 20 0" stroke="var(--grad-cyan)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <rect x="8" y="30" width="4" height="10" rx="2" fill="rgba(124,108,255,0.5)" />
      <rect x="52" y="30" width="4" height="10" rx="2" fill="rgba(124,108,255,0.5)" />
      <defs>
        <linearGradient id="robotHeadGrad" x1="14" y1="18" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#232a55" />
          <stop offset="1" stopColor="#141834" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

const ReadinessRing = ({ value, ready }) => {
  const r = 34
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const color = ready ? 'var(--accent-success)' : 'var(--grad-cyan)'
  return (
    <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <circle
          cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)', transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1), stroke 0.4s ease',
            filter: `drop-shadow(0 0 6px ${color === 'var(--accent-success)' ? 'rgba(47,208,138,0.6)' : 'rgba(69,232,223,0.6)'})`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color,
      }}>
        {value}%
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.25rem 1.5rem 3rem',
    gap: '1.75rem',
  },
  blob1: {
    position: 'fixed', width: '440px', height: '440px', top: '-140px', right: '-120px',
    borderRadius: '50%', filter: 'blur(90px)', opacity: 0.28, zIndex: 0, pointerEvents: 'none',
    background: 'linear-gradient(135deg, var(--grad-blue), var(--grad-purple))',
  },
  header: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: '1320px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
  },
  headerCenter: { textAlign: 'center', flex: 1, minWidth: '260px' },
  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: '380px',
    aspectRatio: '4 / 3',
    margin: '0 auto',
  },
  btn: {
    position: 'relative',
    zIndex: 1,
    padding: '1rem 3.2rem',
  },
}

const INDICATOR_DEFS = [
  { key: 'eyeContact', label: 'Eye Contact', Icon: IconEye },
  { key: 'headPosition', label: 'Head Position', Icon: IconCompass },
  { key: 'faceOrientation', label: 'Face Orientation', Icon: IconFace },
  { key: 'bodyStability', label: 'Body Stability', Icon: IconBody },
  { key: 'posture', label: 'Posture', Icon: IconChair },
  { key: 'cameraAlignment', label: 'Camera Alignment', Icon: IconCamera },
]

// Human-friendly copy shown next to each indicator's Good/Adjust state.
const INDICATOR_HINTS = {
  eyeContact: { good: 'Excellent', bad: 'Look at the camera' },
  headPosition: { good: 'Well centered', bad: 'Center your head' },
  faceOrientation: { good: 'Facing forward', bad: 'Face the camera directly' },
  bodyStability: { good: 'Nice and steady', bad: 'Try to stay still' },
  posture: { good: 'Well aligned', bad: 'Sit upright' },
  cameraAlignment: { good: 'Good framing', bad: 'Adjust your framing' },
}

// Standard MediaPipe FaceMesh face-oval outline indices (in order).
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109, 10,
]
const LEFT_EYE = [33, 133, 159, 145, 468]
const RIGHT_EYE = [362, 263, 386, 374, 473]
const NOSE = [1, 4, 5, 195, 197]
const MOUTH = [61, 291, 0, 17, 13, 14]

export default function CalibrationPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const liteCanvasRef = useRef(null) // hidden canvas used only for brightness sampling
  const cameraRef = useRef(null)
  const audioCtxRef = useRef(null)

  const latestFaceRef = useRef(null)
  const latestPoseRef = useRef(null)
  const shoulderHistoryRef = useRef([])
  const eyeGazeCountRef = useRef(0)

  const [indicators, setIndicators] = useState({
    eyeContact: false,
    headPosition: false,
    faceOrientation: false,
    bodyStability: false,
    posture: false,
    cameraAlignment: false,
  })
  const [warnings, setWarnings] = useState([])
  const [micOk, setMicOk] = useState(false)
  const [camOk, setCamOk] = useState(false)
  const [statusText, setStatusText] = useState('Initializing camera...')

  const ready = Object.values(indicators).every(Boolean) && micOk
  const passedCount = Object.values(indicators).filter(Boolean).length + (micOk ? 1 : 0)
  const readinessPct = Math.round((passedCount / 7) * 100)

  // ── Draw the live landmark overlay (face + upper body) ───────────────────
  const drawOverlay = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const face = latestFaceRef.current
    if (face) {
      ctx.strokeStyle = 'rgba(99,102,241,0.9)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      FACE_OVAL.forEach((idx, i) => {
        const p = face[idx]
        if (!p) return
        const x = p.x * w
        const y = p.y * h
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      ctx.fillStyle = '#4ade80'
      ;[...LEFT_EYE, ...RIGHT_EYE].forEach((idx) => {
        const p = face[idx]
        if (!p) return
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, 2.5, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#facc15'
      NOSE.forEach((idx) => {
        const p = face[idx]
        if (!p) return
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#f472b6'
      MOUTH.forEach((idx) => {
        const p = face[idx]
        if (!p) return
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const pose = latestPoseRef.current
    if (pose) {
      const ls = pose[11]
      const rs = pose[12]
      const le = pose[13]
      const re = pose[14]
      const lw = pose[15]
      const rw = pose[16]

      const drawLine = (a, b) => {
        if (!a || !b) return
        if ((a.visibility ?? 1) < 0.4 || (b.visibility ?? 1) < 0.4) return
        ctx.beginPath()
        ctx.moveTo(a.x * w, a.y * h)
        ctx.lineTo(b.x * w, b.y * h)
        ctx.stroke()
      }

      ctx.strokeStyle = 'rgba(74,222,128,0.85)'
      ctx.lineWidth = 2.5
      drawLine(ls, rs)
      drawLine(ls, le)
      drawLine(le, lw)
      drawLine(rs, re)
      drawLine(re, rw)

      ctx.fillStyle = '#4ade80'
      ;[ls, rs, le, re, lw, rw].forEach((p) => {
        if (!p || (p.visibility ?? 1) < 0.4) return
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    }
  }

  // ── Recompute all 6 indicators + warnings from the latest landmarks ──────
  const analyze = () => {
    const face = latestFaceRef.current
    const pose = latestPoseRef.current
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
      nextWarnings.push('No face detected. Please position yourself in frame.')
      eyeGazeCountRef.current = 0
      setCamOk(false)
    } else {
      // Face bounding box
      const xs = face.map((p) => p.x)
      const ys = face.map((p) => p.y)
      const minX = Math.min(...xs), maxX = Math.max(...xs)
      const minY = Math.min(...ys), maxY = Math.max(...ys)
      const boxW = maxX - minX
      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2

      // Camera alignment: face centered and a reasonable size in frame
      const centered = centerX > 0.28 && centerX < 0.72 && centerY > 0.2 && centerY < 0.8
      const goodSize = boxW > 0.18 && boxW < 0.72
      next.cameraAlignment = centered && goodSize
      if (boxW <= 0.18) nextWarnings.push('Move closer to the camera.')
      if (boxW >= 0.72) nextWarnings.push('Move back from the camera.')
      if (centerX <= 0.28) nextWarnings.push('Move slightly left.')
      if (centerX >= 0.72) nextWarnings.push('Move slightly right.')
      if (centerY <= 0.2) nextWarnings.push('Raise your camera.')
      if (centerY >= 0.8) nextWarnings.push('Lower your camera.')

      // Head position: nose near center of frame
      const nose = face[1]
      next.headPosition = nose && nose.x > 0.3 && nose.x < 0.7 && nose.y > 0.25 && nose.y < 0.75

      // Face orientation: left/right cheek roughly equidistant from nose = facing forward
      const leftCheek = face[234]
      const rightCheek = face[454]
      if (nose && leftCheek && rightCheek) {
        const dLeft = Math.hypot(nose.x - leftCheek.x, nose.y - leftCheek.y)
        const dRight = Math.hypot(nose.x - rightCheek.x, nose.y - rightCheek.y)
        const ratio = dLeft / (dRight || 0.0001)
        next.faceOrientation = ratio > 0.62 && ratio < 1.6
        if (!next.faceOrientation) nextWarnings.push('Face partially visible — please face the camera directly.')
      }

      // Eye contact: iris offset within eye socket ~ centered = looking at screen
      const iris = face[468]
      const innerCorner = face[33]
      const outerCorner = face[133]
      if (iris && innerCorner && outerCorner) {
        const eyeMinX = Math.min(innerCorner.x, outerCorner.x)
        const eyeMaxX = Math.max(innerCorner.x, outerCorner.x)
        const eyeWidth = eyeMaxX - eyeMinX
        if (eyeWidth > 0.001) {
          const offset = (iris.x - eyeMinX) / eyeWidth
          const looking = offset > 0.24 && offset < 0.76
          if (looking) {
            eyeGazeCountRef.current = Math.min(15, eyeGazeCountRef.current + 1.5)
          } else {
            eyeGazeCountRef.current = Math.max(0, eyeGazeCountRef.current - 1)
          }
          next.eyeContact = eyeGazeCountRef.current >= 6
        }
      }

      setCamOk(next.cameraAlignment && next.faceOrientation)
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
        // Posture: shoulders roughly level = sitting upright
        const levelness = Math.abs(ls.y - rs.y)
        next.posture = levelness < 0.085
        if (!next.posture) nextWarnings.push('Sit upright.')

        // Body stability: track shoulder midpoint jitter over recent frames
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
          next.bodyStability = rangeX < 0.05 && rangeY < 0.05
        }
      }
    }

    setIndicators(next)
    setWarnings([...new Set(nextWarnings)].slice(0, 4))

    const allOk = Object.values(next).every(Boolean)
    if (allOk) setStatusText('✅ All checks passed — you can start the interview.')
    else if (!face) setStatusText('Position your face in the camera frame.')
    else setStatusText('Calibrating... follow the tips below.')

    drawOverlay()
  }

  // ── Lighting check: sample average brightness periodically ───────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current
      const liteCanvas = liteCanvasRef.current
      if (!video || !liteCanvas || video.readyState < 2) return
      const ctx = liteCanvas.getContext('2d')
      ctx.drawImage(video, 0, 0, liteCanvas.width, liteCanvas.height)
      const frame = ctx.getImageData(0, 0, liteCanvas.width, liteCanvas.height).data
      let total = 0
      const step = 16
      let count = 0
      for (let i = 0; i < frame.length; i += step) {
        total += (frame[i] + frame[i + 1] + frame[i + 2]) / 3
        count++
      }
      const avgBrightness = total / (count || 1)
      if (avgBrightness < 55) {
        setWarnings((w) => [...new Set([...w, 'Bad lighting — try to improve the lighting in your room.'])].slice(0, 4))
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // ── Camera + mic setup, FaceMesh + Pose ───────────────────────────────────
  useEffect(() => {
    let cleanup = false
    let removeResumeListeners = () => {}

    async function startAll() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoRef.current) videoRef.current.srcObject = stream
        setStatusText('Camera ready — calibrating...')
        setupMic(stream)
        startModels()
      } catch (e) {
        setStatusText('Camera/microphone access denied. Please allow access and refresh.')
      }
    }

    function setupMic(stream) {
      const audioTracks = stream.getAudioTracks()
      if (!audioTracks.length) return
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      // The context can come up "suspended" under the browser's autoplay
      // policy since it isn't constructed directly inside a click handler —
      // when that happens the analyser silently reads near-silence no
      // matter how loud you talk, until something resumes it. Resume it
      // immediately (and once more on the next user gesture, as a safety
      // net for browsers that need that nudge) so mic detection is live
      // from the first frame instead of appearing dead.
      const resumeIfNeeded = () => { if (audioCtx.state === 'suspended') audioCtx.resume() }
      resumeIfNeeded()
      const resumeOnce = () => {
        resumeIfNeeded()
        window.removeEventListener('pointerdown', resumeOnce)
        window.removeEventListener('keydown', resumeOnce)
      }
      window.addEventListener('pointerdown', resumeOnce)
      window.addEventListener('keydown', resumeOnce)
      removeResumeListeners = () => {
        window.removeEventListener('pointerdown', resumeOnce)
        window.removeEventListener('keydown', resumeOnce)
      }

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      // Lower threshold + fewer confirmations needed: catches a normal
      // speaking voice within a couple of frames (~30-60ms) instead of
      // requiring a loud or sustained sound before it registers.
      let detections = 0
      function poll() {
        if (cleanup) return
        resumeIfNeeded()
        analyser.getByteTimeDomainData(data)
        let sumSquares = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sumSquares += v * v
        }
        const rms = Math.sqrt(sumSquares / data.length)
        if (rms > 0.018) {
          detections += 1
          if (detections > 1) setMicOk(true)
        }
        requestAnimationFrame(poll)
      }
      poll()
    }

    function startModels() {
      if (!window.FaceMesh || !window.Pose || !window.Camera) {
        setTimeout(startModels, 800)
        return
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      })
      faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
      faceMesh.onResults((results) => {
        if (cleanup) return
        latestFaceRef.current = results.multiFaceLandmarks?.[0] || null
        analyze()
      })

      const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      })
      pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
      pose.onResults((results) => {
        if (cleanup) return
        latestPoseRef.current = results.poseLandmarks || null
        analyze()
      })

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (!videoRef.current) return
          await faceMesh.send({ image: videoRef.current })
          await pose.send({ image: videoRef.current })
        },
        width: 360,
        height: 270,
      })
      camera.start()
      cameraRef.current = camera
    }

    startAll()
    return () => {
      cleanup = true
      removeResumeListeners()
      if (cameraRef.current) cameraRef.current.stop()
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Presentation-only derived values (no detection logic here) ───────────
  const personality = sessionStorage.getItem('interview_personality') || 'professional'
  const difficulty = sessionStorage.getItem('interview_difficulty') || 'medium'
  const sessionId = sessionStorage.getItem('session_id') || ''
  const lightingOk = !warnings.some((w) => w.toLowerCase().includes('lighting'))

  const STATUS_CARDS = [
    { key: 'eyeContact', label: 'Eyes', Icon: IconEye, ready: indicators.eyeContact },
    { key: 'posture', label: 'Shoulders', Icon: IconBody, ready: indicators.posture },
    { key: 'bodyStability', label: 'Stability', Icon: IconChair, ready: indicators.bodyStability },
    { key: 'faceOrientation', label: 'Face', Icon: IconFace, ready: indicators.faceOrientation },
    { key: 'lighting', label: 'Lighting', Icon: IconBulb, ready: lightingOk },
    { key: 'audio', label: 'Audio', Icon: IconMic, ready: micOk },
    { key: 'cameraAlignment', label: 'Framing', Icon: IconCamera, ready: indicators.cameraAlignment },
  ]

  return (
    <div className="app-page" style={styles.page}>
      <div style={styles.blob1} />
      <div className="particle-field" aria-hidden="true">
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
        <span className="particle" /><span className="particle alt" /><span className="particle" />
        <span className="particle alt" /><span className="particle" /><span className="particle alt" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={styles.header} className="fade-slide-down">
        <div className="app-brand-row">
          <div className="app-brand-logo"><IconSparkle /></div>
          <span className="app-brand-name" style={{ fontSize: '1.15rem' }}>InterviewIQ AI</span>
        </div>
        <div style={styles.headerCenter}>
          <div className="app-eyebrow" style={{ justifyContent: 'center' }}>Camera &amp; Audio Calibration</div>
          <div className="app-subtitle" style={{ marginTop: '0.3rem', fontSize: '0.88rem' }}>
            We'll run a quick check to make sure everything is perfect before your interview.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className="chip" style={{ textTransform: 'capitalize' }}>{personality} · {difficulty}</span>
          {sessionId && <span className="app-muted" style={{ fontSize: '0.78rem' }}>Session: {sessionId.slice(0, 8)}</span>}
        </div>
      </div>

      {/* ── Main 3-column studio ───────────────────────────────────── */}
      <div className="calib-shell">
        {/* Left: AI Coach + Tips + Privacy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card robot-card fade-slide-up">
            <div className="robot-stage">
              <RobotAvatar />
              <div className="robot-bubble">
                <div className="robot-bubble-name">Hello! I'm your AI Interview Coach 🤖</div>
                <div className="robot-bubble-text">
                  I'll help you check your camera, microphone, posture and environment so you can perform your best. Let's get started!
                </div>
                <div className="robot-state-pill listening">● Watching your setup</div>
              </div>
            </div>
            <div className="coach-message">{statusText}</div>
          </div>

          <div className="glass-card" style={{ padding: '1.1rem' }}>
            <div className="app-eyebrow" style={{ marginBottom: '0.75rem' }}><IconBulb /> Quick Tips</div>
            <div className="tip-list">
              {[
                'Sit in a well-lit place',
                'Look at the camera',
                'Avoid bright backlight',
                'Speak clearly',
                'Keep your device steady',
              ].map((t) => (
                <div className="tip-item" key={t}>
                  <span className="tip-check"><IconCheckSm /></span> {t}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card privacy-card" style={{ padding: '1.1rem' }}>
            <div className="privacy-icon"><IconLock /></div>
            <div>
              <div className="privacy-title">Your Privacy Matters</div>
              <div className="privacy-text">Your camera and microphone are used only during the interview process. Your data is secure and never shared without your permission.</div>
            </div>
          </div>
        </div>

        {/* Center: camera preview + status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minWidth: 0 }}>
          <div className={`studio-cam-frame glass-card pulse-glow`} style={styles.videoWrap}>
            <div className="studio-badge-row">
              <span className="studio-live-badge"><span className="studio-live-dot" /> LIVE</span>
              <span className="studio-hd-badge">1080p HD</span>
            </div>
            <video ref={videoRef} autoPlay muted playsInline className="studio-cam-video" />
            <canvas ref={canvasRef} width="360" height="270" className="studio-cam-canvas" />
            <canvas ref={liteCanvasRef} width="32" height="24" style={{ display: 'none' }} />
            <div className="studio-frame-brackets">
              <span className="b-tl" /><span className="b-tr" /><span className="b-bl" /><span className="b-br" />
            </div>
            <div className="studio-cam-footer">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="dot-ok" /> {ready ? "You're ready to begin" : 'Calibrating your setup...'}
              </span>
              <span className="studio-signal-bars"><span /><span /><span /></span>
            </div>
          </div>

          {ready ? (
            <div className="success-summary fade-slide-up">
              <div className="success-summary-icon"><IconCheck /></div>
              <div>
                <div className="success-summary-title">You're Interview Ready!</div>
                <div className="success-summary-text">All required camera, posture, audio, and environment checks have passed successfully. You're ready to begin your AI interview.</div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="status-dot bad" /> <span style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>{statusText}</span>
            </div>
          )}

          <div className="calib-status-grid">
            {STATUS_CARDS.map(({ key, label, Icon, ready: cardReady }) => (
              <div key={key} className={`calib-status-card${cardReady ? ' ready' : ''}`}>
                <div className="calib-status-icon"><Icon /></div>
                <span className="calib-status-name">{label}</span>
                {cardReady && <span className="calib-status-check"><IconCheckSm /></span>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className={`glass-panel ${camOk ? 'indicator-row ok' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Can everyone see me clearly?</span>
              <span className={`status-badge ${camOk ? 'ok' : 'pending'}`}>
                {camOk ? <><IconCheck /> Yes, I'm visible</> : 'Checking...'}
              </span>
            </div>
            <div className={`glass-panel ${micOk ? 'indicator-row ok' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Can everyone hear me clearly?</span>
              <span className={`status-badge ${micOk ? 'ok' : 'pending'}`}>
                {micOk ? <><IconCheck /> Yes, I can be heard</> : 'Please say something...'}
              </span>
            </div>
          </div>

          <button
            className="app-btn-primary"
            style={{ ...styles.btn, alignSelf: 'center' }}
            onClick={() => navigate('/interview')}
            disabled={!ready}
          >
            Start Interview <IconArrow />
          </button>
        </div>

        {/* Right: readiness ring + live checks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card fade-slide-up" style={{ padding: '1.1rem' }}>
            <div className="readiness-header">
              <div>
                <div className="readiness-copy-title">Interview Readiness</div>
                <div className="readiness-copy-sub">
                  {ready ? 'All checks complete!' : 'Almost there! Just a few checks remaining.'}
                </div>
              </div>
              <ReadinessRing value={readinessPct} ready={ready} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div className="app-eyebrow" style={{ marginBottom: '0.2rem' }}>Live Checks</div>
            {INDICATOR_DEFS.map(({ key, label, Icon }) => {
              const ok = indicators[key]
              const hint = INDICATOR_HINTS[key]
              return (
                <div key={key} className={`mon-row${ok ? ' ok' : ' warn'}`}>
                  <span className="mon-label"><Icon /> {label}</span>
                  <span className="mon-state">
                    {ok ? <IconCheckSm /> : '⚠'} {ok ? hint.good : hint.bad}
                  </span>
                </div>
              )
            })}
            <div className={`mon-row${micOk ? ' ok' : ' warn'}`}>
              <span className="mon-label"><IconMic /> Microphone</span>
              <span className="mon-state">
                {micOk ? <IconCheckSm /> : '⚠'} {micOk ? 'Working well' : 'Say something'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}