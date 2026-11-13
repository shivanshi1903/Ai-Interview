import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import CalibrationPage from './pages/CalibrationPage.jsx'
import InterviewPage from './pages/InterviewPage.jsx'
import ResultPage from './pages/ResultPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/calibrate" element={<CalibrationPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  </BrowserRouter>
)
