import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ student_id: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = '같이타 - 로그인'
    if (localStorage.getItem('token')) navigate('/')
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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
      localStorage.setItem('isLoggedIn', 'true')
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #ECFDF5 0%, #D1FAE5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* 로고 + 슬로건 */}
        <div className="text-center mb-4">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
              marginBottom: '16px',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.227.531.35 1.102.35 1.684V12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H2v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.047c0-.582.123-1.153.35-1.684zm-1.5 7.065.5 1H14l.5-1H1.02zM14 7.519l-.427-1H2.427L2 7.52V9h12V7.52z" />
              <path d="M2.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--color-text)',
              letterSpacing: '-0.04em',
              marginBottom: '6px',
            }}
          >
            같이<span style={{ color: 'var(--color-primary)' }}>타</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)' }}>
            단국대 교내 카풀 · 택시 동승 매칭
          </p>
        </div>

        {/* 로그인 카드 */}
        <div
          className="card border-0"
          style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
        >
          <div className="card-body p-4">
            <h2 className="fs-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>로그인</h2>

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
                  required
                  autoComplete="username"
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
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: loading
                    ? 'rgba(100,116,139,0.1)'
                    : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  color: loading ? 'var(--color-text-muted)' : '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 2px 8px rgba(16,185,129,0.35)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>

            </form>

            <p className="text-center mt-4 mb-0 small" style={{ color: 'var(--color-text-sub)' }}>
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                style={{ color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none' }}
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 개발용 테스트 계정 안내 */}
        <div className="mt-3 p-3 rounded-3" style={{ background: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
          <p className="small fw-semibold mb-1" style={{ color: 'var(--color-primary-dark)' }}>
            테스트 계정
          </p>
          <p className="small mb-0 text-secondary">
            학번: <strong>2021001</strong> &nbsp;|&nbsp; 비밀번호: <strong>password123</strong>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
