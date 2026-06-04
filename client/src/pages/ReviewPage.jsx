import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function StarPicker({ rating, onRate }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || rating

  return (
    <div className="d-flex gap-2" role="group" aria-label="별점 선택">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="btn p-0 border-0 bg-transparent"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star}점`}
          aria-pressed={rating === star}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill={star <= active ? '#ffc107' : '#dee2e6'}
            viewBox="0 0 16 16"
            aria-hidden="true"
            style={{ transition: 'fill 0.1s' }}
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const RATING_LABELS = ['', '별로예요', '그저 그래요', '괜찮아요', '좋았어요', '최고예요!']

function ReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    document.title = '같이타 - 후기 작성'
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.post('/api/reviews', {
        rideId: Number(id),
        rating,
        text,
        reviewer_id: 1, // 로그인 연동 후 실제 유저 ID로 교체
      })
      alert('후기가 등록됐어요!')
      navigate(`/rides/${id}`)
    } catch (err) {
      if (err.response?.status === 400) {
        alert('완료된 동승에만 후기를 남길 수 있어요.')
      } else if (err.response?.status === 409) {
        alert('이미 후기를 작성했어요.')
      } else {
        alert('후기 등록 중 오류가 발생했어요.')
      }
    }
  }

  return (
    <div className="container py-4 px-3" style={{ maxWidth: 600 }}>

      {/* 뒤로가기 */}
      <button
        className="btn btn-link ps-0 mb-3 text-secondary text-decoration-none d-flex align-items-center gap-1"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        </svg>
        상세로 돌아가기
      </button>

      <h2 className="fs-5 fw-bold mb-4">후기 작성</h2>

      <form onSubmit={handleSubmit}>

        {/* 별점 선택 */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body p-4">
            <p className="fw-semibold mb-3">이번 동승은 어떠셨나요?</p>
            <div className="d-flex flex-column align-items-center gap-2">
              <StarPicker rating={rating} onRate={setRating} />
              <span className="small fw-medium" style={{ color: rating ? '#ffc107' : '#adb5bd', minHeight: '1.5rem' }}>
                {RATING_LABELS[rating]}
              </span>
            </div>
          </div>
        </div>

        {/* 후기 텍스트 */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <label htmlFor="review-text" className="form-label fw-semibold">
              후기 <span className="text-secondary fw-normal">(선택)</span>
            </label>
            <textarea
              id="review-text"
              className="form-control"
              rows={5}
              placeholder="동승 경험을 자유롭게 남겨주세요."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* 취소 / 제출 버튼 */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill py-3 fw-semibold"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: rating === 0
                ? 'rgba(100,116,139,0.1)'
                : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              color: rating === 0 ? 'var(--color-text-muted)' : '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: rating === 0 ? 'not-allowed' : 'pointer',
              boxShadow: rating === 0 ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
            }}
            disabled={rating === 0}
          >
            제출하기
          </button>
        </div>

      </form>
    </div>
  )
}

export default ReviewPage
