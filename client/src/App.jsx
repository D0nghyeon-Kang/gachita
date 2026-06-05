import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
