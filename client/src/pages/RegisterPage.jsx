import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  )
}

function EyeSlashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    studentId: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    gender: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  useEffect(() => {
    document.title = '같이타 - 회원가입'
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}

    if (!form.studentId) {
      newErrors.studentId = '학번을 입력해주세요.'
    } else if (!/^\d{8,10}$/.test(form.studentId)) {
      newErrors.studentId = '학번은 8~10자리 숫자로 입력해주세요.'
    }

    if (!form.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.'
    } else if (form.nickname.length < 2 || form.nickname.length > 10) {
      newErrors.nickname = '닉네임은 2~10자로 입력해주세요.'
    }

    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (form.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상으로 입력해주세요.'
    }

    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않아요.'
    }

    if (!form.gender) {
      newErrors.gender = '성별을 선택해주세요.'
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    // 회원가입 API 연동 전 임시 처리
    navigate('/login')
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

        {/* 로고 */}
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

        {/* 회원가입 카드 */}
        <div
          className="card border-0"
          style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
        >
          <div className="card-body p-4">
            <h2 className="fs-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>회원가입</h2>

            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label htmlFor="reg-studentId" className="form-label fw-semibold small">
                  학번 <span className="text-danger">*</span>
                </label>
                <input
                  id="reg-studentId"
                  name="studentId"
                  type="text"
                  className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                  placeholder="예: 20210001"
                  value={form.studentId}
                  onChange={handleChange}
                  autoComplete="username"
                />
                {errors.studentId && (
                  <p className="mt-1 mb-0 small" style={{ color: '#DC2626' }}>{errors.studentId}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="reg-nickname" className="form-label fw-semibold small">
                  닉네임 <span className="text-danger">*</span>
                </label>
                <input
                  id="reg-nickname"
                  name="nickname"
                  type="text"
                  className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
                  placeholder="사용할 닉네임을 입력하세요 (2~10자)"
                  value={form.nickname}
                  onChange={handleChange}
                  autoComplete="nickname"
                />
                {errors.nickname && (
                  <p className="mt-1 mb-0 small" style={{ color: '#DC2626' }}>{errors.nickname}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="reg-password" className="form-label fw-semibold small">
                  비밀번호 <span className="text-danger">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="6자 이상 입력하세요"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    style={{ paddingRight: '44px', backgroundImage: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-text-sub)',
                      lineHeight: 1,
                    }}
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 mb-0 small" style={{ color: '#DC2626' }}>{errors.password}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="reg-passwordConfirm" className="form-label fw-semibold small">
                  비밀번호 확인 <span className="text-danger">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                    style={{ paddingRight: '44px', backgroundImage: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-text-sub)',
                      lineHeight: 1,
                    }}
                  >
                    {showPasswordConfirm ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="mt-1 mb-0 small" style={{ color: '#DC2626' }}>{errors.passwordConfirm}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">
                  성별 <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  {[
                    { value: 'male',   label: '남성' },
                    { value: 'female', label: '여성' },
                    { value: 'other',  label: '기타' },
                  ].map(({ value, label }) => (
                    <div className="form-check" key={value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id={`gender-${value}`}
                        value={value}
                        checked={form.gender === value}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small" htmlFor={`gender-${value}`}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 mb-0 small" style={{ color: '#DC2626' }}>{errors.gender}</p>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '13px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                회원가입
              </button>

            </form>

            <p className="text-center mt-4 mb-0 small" style={{ color: 'var(--color-text-sub)' }}>
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none' }}
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage
