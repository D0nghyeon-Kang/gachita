import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios'

const MOCK_RIDES = [
  {
    id: 1,
    origin: '기숙사',
    destination: '서울역',
    depart_at: '2026-05-26 08:30',
    total_seats: 4,
    filled_seats: 2,
    cost_total: 4500,
    rating: 4.8,
    status: 'open',
    driver: {
      name: '이준호',
      rating: 4.8,
      trips: 34,
      carModel: '현대 아반떼',
    },
  },
  {
    id: 2,
    origin: '정문',
    destination: '강남역',
    depart_at: '2026-05-26 09:00',
    total_seats: 4,
    filled_seats: 3,
    cost_total: 7200,
    rating: 4.5,
    status: 'completed',
    driver: {
      name: '박서연',
      rating: 4.5,
      trips: 21,
      carModel: '기아 K3',
    },
  },
  {
    id: 3,
    origin: '후문',
    destination: '수원역',
    depart_at: '2026-05-26 10:15',
    total_seats: 4,
    filled_seats: 4,
    cost_total: 3800,
    rating: 4.2,
    status: 'open',
    driver: {
      name: '최민준',
      rating: 4.2,
      trips: 12,
      carModel: '쉐보레 스파크',
    },
  },
]

function StarRating({ rating, size = 16 }) {
  return (
    <span aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill={star <= Math.round(rating) ? '#ffc107' : '#dee2e6'}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
      <span className="ms-1 fw-semibold">{rating.toFixed(1)}</span>
    </span>
  )
}

function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [ride, setRide] = useState(null)

  // ── 서버에서 라이드 상세 불러오기 ──
  useEffect(() => {
    api.get(`/api/rides/${id}`)
      .then(res => setRide(res.data))
      .catch(() => {
        // 서버 꺼져 있으면 MOCK으로 대체
        const mock = MOCK_RIDES.find(r => r.id === Number(id))
        setRide(mock || null)
      })
  }, [id])

  useEffect(() => {
    document.title = ride
      ? `같이타 - ${ride.origin} → ${ride.destination}`
      : '같이타 - 상세'
  }, [ride])

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
  const seatsColor =
    seatsLeft === 0 ? 'text-danger' : seatsLeft <= 1 ? 'text-warning' : 'text-success'
  const seatsBadge =
    seatsLeft === 0 ? 'bg-danger' : seatsLeft <= 1 ? 'bg-warning text-dark' : 'bg-success'

  async function handleApply() {
    try {
      await api.post('/api/applications', {
        ride_id: Number(id),
        applicant_id: 1, // 로그인 연동 후 실제 유저 ID로 교체
      })
      setApplied(true)

      // ✅ 신청 완료 후 서버에서 최신 ride 다시 불러오기 → 잔여 좌석 즉시 반영
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
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'var(--color-primary-bg)',
                color: 'var(--color-primary-dark)',
              }}>
                {origin}
              </div>
              <div className="small text-secondary mt-1">출발지</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-secondary flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
            <div className="text-center">
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'var(--color-primary-bg)',
                color: 'var(--color-primary-dark)',
              }}>
                {destination}
              </div>
              <div className="small text-secondary mt-1">목적지</div>
            </div>
          </div>

          {/* 잔여 좌석 배지 */}
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
          <h6 className="fw-bold mb-3 text-secondary small text-uppercase letter-spacing-1">동승 정보</h6>
          <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                출발 시간
              </span>
              <span className="fw-semibold">{depart_at}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 1.5a.5.5 0 1 0-1 0V13a.5.5 0 0 0 .75.433L8 10.414l5.25 3.019A.5.5 0 0 0 14 13V1.5a.5.5 0 0 0-1 0v11.048l-4.75-2.732-4.75 2.732V1.5z"/>
                </svg>
                잔여 좌석
              </span>
              <span className={`fw-bold ${seatsColor}`}>
                {seatsLeft === 0 ? '마감' : `${seatsLeft}석`}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.051zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                </svg>
                예상 비용
              </span>
              <span className="fw-bold" style={{ color: 'var(--color-primary)' }}>{cost_total.toLocaleString()}원</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                평점
              </span>
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
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 52, height: 52, background: 'var(--color-primary-bg)' }}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--color-primary)" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{driver.name}</div>
              <div className="small text-secondary">{driver.carModel}</div>
            </div>
            <div className="text-end">
              <div className="small">
                <StarRating rating={driver.rating} size={13} />
              </div>
              <div className="small text-secondary mt-1">{driver.trips}회 운행</div>
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
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: seatsLeft === 0 ? 'not-allowed' : 'pointer',
            background: seatsLeft === 0
              ? 'rgba(100,116,139,0.1)'
              : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: seatsLeft === 0 ? 'var(--color-text-muted)' : '#FFFFFF',
            boxShadow: seatsLeft === 0 ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
          }}
          disabled={seatsLeft === 0}
          onClick={handleApply}
        >
          {seatsLeft === 0 ? '모집이 마감됐어요' : '참여 신청하기'}
        </button>
      )}

      {/* 후기 작성 버튼: 동승 완료 시에만 표시 */}
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
