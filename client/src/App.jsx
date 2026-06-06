import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import RegisterPage from './pages/RegisterPage'

const NO_NAVBAR_PATHS = ['/login', '/register']

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Toast />
        <Layout />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
