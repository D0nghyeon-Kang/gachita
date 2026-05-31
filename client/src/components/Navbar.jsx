import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom shadow-sm sticky-top">
      <div className="container">

        {/* 로고 */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-primary fs-5"
        >
          같이타
        </Link>

        {/* 햄버거 토글 */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="메뉴 열기/닫기"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* 메뉴 */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
          <ul className="navbar-nav gap-1 align-items-md-center py-2 py-md-0">

            <li className="nav-item">
              <Link
                to="/write"
                className={`btn btn-sm d-flex align-items-center gap-1 ${
                  isActive('/write')
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                </svg>
                글쓰기
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/profile"
                className={`btn btn-sm d-flex align-items-center gap-1 ${
                  isActive('/profile')
                    ? 'btn-secondary'
                    : 'btn-outline-secondary'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
                프로필
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
