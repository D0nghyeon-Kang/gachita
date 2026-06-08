import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/Toast'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DetailPage'
import WritePage from './pages/WritePage'
import ReviewPage from './pages/ReviewPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

const NO_NAVBAR_PATHS = ['/login', '/register', '/signup']

function Layout() {
  const { pathname } = useLocation()
  const showNavbar = !NO_NAVBAR_PATHS.includes(pathname)
  return (
    <>
      {showNavbar && <Navbar />}
      <div key={pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/rides/:id" element={<DetailPage />} />
          <Route path="/rides/:id/review" element={<ReviewPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Toast />
          <Layout />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
