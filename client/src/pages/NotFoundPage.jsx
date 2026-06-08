import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '가치타 - 페이지를 찾을 수 없습니다'
  }, [])

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: '60vh', padding: '2rem 1rem' }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-4"
        style={{ width: 80, height: 80, background: 'var(--color-primary-bg)' }}
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="var(--color-primary)" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
      </div>
      <h1 className="fs-4 fw-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-secondary mb-4" style={{ maxWidth: 280 }}>
        요청하신 주소가 존재하지 않거나 삭제된 페이지예요.
      </p>
      <button
        style={{
          padding: '12px 28px',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
        }}
        onClick={() => navigate('/')}
      >
        메인으로 돌아가기
      </button>
    </div>
  )
}

export default NotFoundPage
