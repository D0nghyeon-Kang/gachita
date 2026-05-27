import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DetailPage'
import WritePage from './pages/WritePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rides/:id" element={<DetailPage />} />
        <Route path="/write" element={<WritePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
