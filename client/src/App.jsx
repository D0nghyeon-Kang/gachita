import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DetailPage'
import WritePage from './pages/WritePage'
import ReviewPage from './pages/ReviewPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rides/:id" element={<DetailPage user={user} />} />
        <Route path="/rides/:id/review" element={<ReviewPage user={user} />} />
        <Route path="/write" element={<WritePage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
