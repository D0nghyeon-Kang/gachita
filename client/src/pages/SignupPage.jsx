import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const INITIAL_FORM = {
  student_id: '',
  password: '',
  password_confirm: '',
  nickname: '',
  gender: 'other',
}

function SignupPage() {
  const navigate = useNavigate()
  const { login, token } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = '같이타 - 회원가입'
    if (token) navigate('/')
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // 유효성 검사
    if (!form.student_id || !form.password || !form.nickname) {
      setError('모든 필수 항목을 입력해주세요.')
      return
    }
    if (form.password !== form.password_confirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/api/auth/signup', {
        student_id: form.student_id,
        password: form.password,
        nickname: form.nickname,
        gender: form.gender,
      })
      login(res.data.user, res.data.token)
      alert(`환영해요, ${res.data.user.nickname}님! 🎉`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '회원가입에 실패했어요. 다시 시도해주세요.')
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

      {/* 회원가입 폼 */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="fs-5 fw-bold mb-4 text-center">회원가입</h2>

          {error && (
            <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* 학번 */}
            <div className="mb-3">
              <label htmlFor="student_id" className="form-label fw-semibold small">
                학번 <span className="text-danger">*</span>
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
              />
            </div>

            {/* 닉네임 */}
            <div className="mb-3">
              <label htmlFor="nickname" className="form-label fw-semibold small">
                닉네임 <span className="text-danger">*</span>
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="form-control"
                placeholder="앱에서 표시될 이름"
                value={form.nickname}
                onChange={handleChange}
                required
              />
            </div>

            {/* 성별 */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">성별</label>
              <div className="d-flex gap-3">
                {[
                  { value: 'male', label: '남성' },
                  { value: 'female', label: '여성' },
                  { value: 'other', label: '선택 안 함' },
                ].map(opt => (
                  <div key={opt.value} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id={`gender_${opt.value}`}
                      value={opt.value}
                      checked={form.gender === opt.value}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small" htmlFor={`gender_${opt.value}`}>
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold small">
                비밀번호 <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="6자 이상"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-4">
              <label htmlFor="password_confirm" className="form-label fw-semibold small">
                비밀번호 확인 <span className="text-danger">*</span>
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                className="form-control"
                placeholder="비밀번호 재입력"
                value={form.password_confirm}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {form.password_confirm && form.password !== form.password_confirm && (
                <div className="form-text text-danger">비밀번호가 일치하지 않아요.</div>
              )}
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
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="small text-secondary">이미 계정이 있으신가요? </span>
            <Link to="/login" className="small fw-semibold" style={{ color: 'var(--color-primary)' }}>
              로그인
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SignupPage
