import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ student_id: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = '같이타 - 로그인'
    // 이미 로그인된 경우 메인으로
    if (localStorage.getItem('token')) navigate('/')
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.student_id || !form.password) {
      setError('학번과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin && onLogin(res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 px-3" style={{ maxWidth: 420 }}>

      {/* 로고 */}
      <div className="text-center mb-4">
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 56, height: 56, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          boxShadow: '0 4px 16px rgba(16,185,129,0.3)', marginBottom: 12,
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
            <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.227.531.35 1.102.35 1.684V12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H2v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.047c0-.582.123-1.153.35-1.684zm-1.5 7.065.5 1H14l.5-1H1.02zM14 7.519l-.427-1H2.427L2 7.52V9h12V7.52z"/>
            <path d="M2.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.04em' }}>
          같이<span style={{ color: 'var(--color-primary)' }}>타</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', marginTop: 4 }}>
          단국대학교 카풀 동승 매칭 서비스
        </p>
      </div>

      {/* 로그인 폼 */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="fs-5 fw-bold mb-4 text-center">로그인</h2>

          {error && (
            <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="student_id" className="form-label fw-semibold small">
                학번
              </label>
              <input
                id="student_id"
                name="student_id"
                type="text"
                className="form-control"
                placeholder="예: 2021001"
                value={form.student_id}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold small">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', border: 'none',
                borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)',
                fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(100,116,139,0.1)'
                  : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: loading ? 'var(--color-text-muted)' : '#FFFFFF',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="small text-secondary">아직 계정이 없으신가요? </span>
            <Link to="/signup" className="small fw-semibold" style={{ color: 'var(--color-primary)' }}>
              회원가입
            </Link>
          </div>
        </div>
      </div>

      {/* 개발용 테스트 계정 안내 */}
      <div className="mt-3 p-3 rounded-3" style={{ background: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
        <p className="small fw-semibold mb-1" style={{ color: 'var(--color-primary-dark)' }}>
          🧪 테스트 계정
        </p>
        <p className="small mb-0 text-secondary">
          학번: <strong>2021001</strong> &nbsp;|&nbsp; 비밀번호: <strong>password123</strong>
        </p>
      </div>

    </div>
  )
}

export default LoginPage
