import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function StarRating({ rating, size = 16 }) {
  const safeRating = Number(rating) || 0
  return (
    <span aria-label={`별점 ${safeRating}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill={star <= Math.round(safeRating) ? '#ffc107' : '#dee2e6'}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
      <span className="ms-1 fw-semibold">{safeRating.toFixed(1)}</span>
    </span>
  )
}

function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [applied, setApplied] = useState(false)
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/rides/${id}`)
      .then(res => {
        setRide(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    document.title = ride
      ? `가치타 - ${ride.origin} → ${ride.destination}`
      : '가치타 - 상세'
  }, [ride])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary">불러오는 중...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary">동승 정보를 찾을 수 없어요.</p>
        <button
          style={{
            marginTop: '8px',
            padding: '8px 20px',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-pill)',
            background: 'transparent',
            color: 'var(--color-primary-dark)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          목록으로 돌아가기
        </button>
      </div>
    )
  }

  const { origin, destination, depart_at, total_seats, filled_seats, cost_total, rating, status, driver } = ride

  const seatsLeft = total_seats - filled_seats
  const seatsColor = seatsLeft === 0 ? 'text-danger' : seatsLeft <= 1 ? 'text-warning' : 'text-success'
  const seatsBadge = seatsLeft === 0 ? 'bg-danger' : seatsLeft <= 1 ? 'bg-warning text-dark' : 'bg-success'

  async function handleApply() {
    if (!user) {
      alert('로그인이 필요해요.')
      navigate('/login')
      return
    }
    try {
      await api.post('/api/applications', {
        ride_id: Number(id),
        applicant_id: user.id,
      })
      setApplied(true)
      const res = await api.get(`/api/rides/${id}`)
      setRide(res.data)
    } catch (err) {
      if (err.response?.status === 409) {
        alert('이미 신청한 동승이에요.')
      } else {
        alert('신청 중 오류가 발생했어요.')
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
        목록으로
      </button>

      {/* 출발지 → 목적지 헤더 */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <div className="text-center">
              <div style={{ fontSize: '1rem', fontWeight: 600, padding: '8px 16px', borderRadius: '9999px', background: 'var(--color-primary-bg)', color: 'var(--color-primary-dark)' }}>
                {origin}
              </div>
              <div className="small text-secondary mt-1">출발지</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-secondary flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
            <div className="text-center">
              <div style={{ fontSize: '1rem', fontWeight: 600, padding: '8px 16px', borderRadius: '9999px', background: 'var(--color-primary-bg)', color: 'var(--color-primary-dark)' }}>
                {destination}
              </div>
              <div className="small text-secondary mt-1">목적지</div>
            </div>
          </div>
          <div className="text-center">
            <span className={`badge ${seatsBadge} rounded-pill px-3 py-1`}>
              {seatsLeft === 0 ? '마감' : `잔여 ${seatsLeft}석`}
            </span>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3 text-secondary small text-uppercase">동승 정보</h6>
          <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">출발 시간</span>
              <span className="fw-semibold">{depart_at}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">잔여 좌석</span>
              <span className={`fw-bold ${seatsColor}`}>
                {seatsLeft === 0 ? '마감' : `${seatsLeft}석`}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">예상 비용</span>
              <span className="fw-bold" style={{ color: 'var(--color-primary)' }}>{cost_total.toLocaleString()}원</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">평점</span>
              <StarRating rating={rating} size={15} />
            </li>
          </ul>
        </div>
      </div>

      {/* 모집자 정보 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3 text-secondary small text-uppercase">모집자 정보</h6>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'var(--color-primary-bg)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--color-primary)" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{driver?.name}</div>
              <div className="small text-secondary">{driver?.carModel}</div>
            </div>
            <div className="text-end">
              <div className="small"><StarRating rating={driver?.rating} size={13} /></div>
              <div className="small text-secondary mt-1">{driver?.trips}회 운행</div>
            </div>
          </div>
        </div>
      </div>

      {/* 참여 신청 버튼 */}
      {applied ? (
        <div className="alert alert-success text-center fw-semibold" role="alert">
          신청이 완료됐어요! 출발 전 연락이 올 거예요.
        </div>
      ) : (
        <button
          style={{
            width: '100%', padding: '14px', border: 'none',
            borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)',
            fontWeight: 700, fontSize: '1rem',
            cursor: seatsLeft === 0 ? 'not-allowed' : 'pointer',
            background: seatsLeft === 0 ? 'rgba(100,116,139,0.1)' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: seatsLeft === 0 ? 'var(--color-text-muted)' : '#FFFFFF',
            boxShadow: seatsLeft === 0 ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
          }}
          disabled={seatsLeft === 0}
          onClick={handleApply}
        >
          {seatsLeft === 0 ? '모집이 마감됐어요' : '참여 신청하기'}
        </button>
      )}

      {/* 후기 작성 버튼 */}
      {status === 'completed' && (
        <button
          className="btn btn-outline-secondary w-100 py-2 mt-2 fw-semibold"
          onClick={() => navigate(`/rides/${id}/review`)}
        >
          후기 작성
        </button>
      )}

    </div>
  )
}

export default DetailPage
