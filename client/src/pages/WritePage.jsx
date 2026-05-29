import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_FORM = {
  from: '',
  to: '',
  departureDate: '',
  departureTime: '',
  seats: '1',
  estimatedCost: '',
}

function WritePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('게시글 등록 입력값:', {
      ...form,
      seats: Number(form.seats),
      estimatedCost: Number(form.estimatedCost),
      departureTime: `${form.departureDate} ${form.departureTime}`,
    })
  }

  return (
    <div className="container py-4 px-3" style={{ maxWidth: 600 }}>

      {/* 뒤로가기 */}
      <button
        type="button"
        className="btn btn-link ps-0 mb-3 text-secondary text-decoration-none d-flex align-items-center gap-1"
        onClick={() => navigate('/')}
        aria-label="메인으로 돌아가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        </svg>
        목록으로
      </button>

      <header className="mb-4">
        <h1 className="fs-4 fw-bold mb-1">동승 모집 글 작성</h1>
        <p className="text-secondary small mb-0">함께 이동할 동승자를 모집해 보세요.</p>
      </header>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>

            {/* 출발지 / 목적지 */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label htmlFor="from" className="form-label fw-semibold">
                  출발지 <span className="text-danger">*</span>
                </label>
                <input
                  id="from"
                  name="from"
                  type="text"
                  className="form-control"
                  placeholder="예: 기숙사, 정문"
                  value={form.from}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6">
                <label htmlFor="to" className="form-label fw-semibold">
                  목적지 <span className="text-danger">*</span>
                </label>
                <input
                  id="to"
                  name="to"
                  type="text"
                  className="form-control"
                  placeholder="예: 서울역, 강남역"
                  value={form.to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 출발 날짜 / 시간 */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label htmlFor="departureDate" className="form-label fw-semibold">
                  출발 날짜 <span className="text-danger">*</span>
                </label>
                <input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  className="form-control"
                  value={form.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6">
                <label htmlFor="departureTime" className="form-label fw-semibold">
                  출발 시간 <span className="text-danger">*</span>
                </label>
                <input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  className="form-control"
                  value={form.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 모집 인원 */}
            <div className="mb-3">
              <label htmlFor="seats" className="form-label fw-semibold">
                모집 인원 <span className="text-danger">*</span>
              </label>
              <select
                id="seats"
                name="seats"
                className="form-select"
                value={form.seats}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}명</option>
                ))}
              </select>
              <div className="form-text">운전자 제외 탑승 가능 인원을 선택하세요.</div>
            </div>

            {/* 예상 비용 */}
            <div className="mb-4">
              <label htmlFor="estimatedCost" className="form-label fw-semibold">
                예상 비용 (원) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  id="estimatedCost"
                  name="estimatedCost"
                  type="number"
                  className="form-control"
                  placeholder="예: 5000"
                  min="0"
                  step="100"
                  value={form.estimatedCost}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text">원</span>
              </div>
              <div className="form-text">1인 기준 예상 비용을 입력하세요.</div>
            </div>

            {/* 버튼 영역 */}
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1 py-2 fw-semibold"
              >
                등록하기
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1 py-2 fw-semibold"
                onClick={() => navigate('/')}
              >
                취소
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  )
}

export default WritePage
