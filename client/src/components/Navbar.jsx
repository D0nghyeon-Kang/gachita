import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => pathname === path
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  function handleLogout() {
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <nav
      className="sticky-top"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-navbar)',
        zIndex: 1000,
      }}
    >
      <div
        className="container d-flex align-items-center justify-content-between"
        style={{ height: '60px' }}
      >

        {/* 로고 */}
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none"
          style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.227.531.35 1.102.35 1.684V12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H2v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.047c0-.582.123-1.153.35-1.684zm-1.5 7.065.5 1H14l.5-1H1.02zM14 7.519l-.427-1H2.427L2 7.52V9h12V7.52z" />
              <path d="M2.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </span>
          <span style={{ color: 'var(--color-text)' }}>같이<span style={{ color: 'var(--color-primary)' }}>타</span></span>
        </Link>

        {/* 햄버거 (모바일) */}
        <button
          className="navbar-toggler border-0 d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="메뉴 열기/닫기"
          style={{ color: 'var(--color-text-sub)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
        </button>

        {/* 메뉴 */}
        <div className="collapse navbar-collapse justify-content-end d-md-flex" id="navbarMenu">
          <div className="d-flex align-items-center gap-2 py-2 py-md-0">

            {isLoggedIn ? (
              <>
                <Link
                  to="/write"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    transition: 'all 0.18s ease',
                    textDecoration: 'none',
                    ...(isActive('/write')
                      ? {
                          background: 'var(--color-primary)',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                        }
                      : {
                          background: 'var(--color-primary-bg)',
                          color: 'var(--color-primary-dark)',
                          border: '1px solid var(--color-primary-light)',
                        }),
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                  </svg>
                  글쓰기
                </Link>

                <Link
                  to="/profile"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    transition: 'all 0.18s ease',
                    textDecoration: 'none',
                    ...(isActive('/profile')
                      ? {
                          background: 'var(--color-text)',
                          color: '#FFFFFF',
                        }
                      : {
                          background: 'transparent',
                          color: 'var(--color-text-sub)',
                          border: '1px solid var(--color-border)',
                        }),
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                  프로필
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    transition: 'all 0.18s ease',
                    background: 'transparent',
                    color: 'var(--color-text-sub)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                로그인
              </Link>
            )}

          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
