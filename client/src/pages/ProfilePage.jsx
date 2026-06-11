import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const MOCK_USER = {
  nickname: '김민석',
  student_id: '20210001',
  manner_score: 36.5,
  ride_count: 12,
}

const STATUS_MAP = {
  open:      { label: '모집중', color: 'success' },
  closed:    { label: '마감',   color: 'warning' },
  completed: { label: '완료',   color: 'secondary' },
  cancelled: { label: '취소',   color: 'danger' },
}

const MOCK_MY_RIDES = [
  {
    id: 1,
    origin: '기숙사',
    destination: '서울역',
    depart_at: '2026-06-01 08:30',
    status: 'open',
  },
  {
    id: 2,
    origin: '정문',
    destination: '강남역',
    depart_at: '2026-05-28 09:00',
    status: 'completed',
  },
]

const MOCK_APPLIED_RIDES = [
  {
    id: 3,
    origin: '후문',
    destination: '수원역',
    depart_at: '2026-06-02 10:15',
    status: 'open',
  },
  {
    id: 4,
    origin: '기숙사',
    destination: '잠실역',
    depart_at: '2026-05-30 18:00',
    status: 'completed',
  },
]

const MOCK_REVIEWS = [
  {
    id: 1,
    author: '이준호',
    rating: 5,
    content: '시간도 딱 맞추고, 매너도 너무 좋으셨어요. 다음에 또 같이 타고 싶어요!',
    date: '2026-05-28',
  },
  {
    id: 2,
    author: '박서연',
    rating: 4,
    content: '조용하고 편안한 동승이었습니다. 정류장도 잘 알고 계셨어요.',
    date: '2026-05-30',
  },
]

function mannerBarColor(score) {
  if (score < 34) return '#3b82f6'
  if (score < 38) return 'var(--color-primary)'
  if (score < 42) return '#f97316'
  return '#ef4444'
}

function StarMini({ rating }) {
  return (
    <span aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          fill={s <= rating ? '#ffc107' : '#dee2e6'}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
      ))}
    </span>
  )
}

function StatusBadge({ status }) {
  const { label, color } = STATUS_MAP[status] ?? { label: status, color: 'secondary' }
  return (
    <span className={`badge bg-${color}-subtle text-${color} rounded-pill px-2 py-1`}>
      {label}
    </span>
  )
}

function RideRowCard({ ride }) {
  const navigate = useNavigate()
  const { id, origin, destination, depart_at, status } = ride

  return (
    <div
      className="card border-0 bg-light mb-2"
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/rides/${id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/rides/${id}`)}
      aria-label={`${origin}에서 ${destination} 동승 상세 보기`}
    >
      <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2 fw-semibold small flex-grow-1 min-w-0">
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'var(--color-primary-bg)',
            color: 'var(--color-primary-dark)',
          }}>
            {origin}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            className="text-secondary flex-shrink-0"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'var(--color-primary-bg)',
            color: 'var(--color-primary-dark)',
          }}>
            {destination}
          </span>
        </div>
        <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
          <StatusBadge status={status} />
          <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{depart_at}</span>
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [applicants, setApplicants] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = '가치타 - 프로필'
    if (!authUser) { navigate('/login'); return }
    api.get('/api/users/me', { params: { user_id: authUser.id } })
      .then(res => {
        setUserData(res.data)
        setLoading(false)
        // 내가 등록한 라이드의 신청자 목록 불러오기
        res.data.myRides?.forEach(ride => {
          if (ride.status === 'open') {
            api.get('/api/applications', { params: { ride_id: ride.id } })
              .then(r => setApplicants(prev => ({ ...prev, [ride.id]: r.data })))
          }
        })
      })
      .catch(() => {
        setUserData({ ...MOCK_USER, ...authUser, myRides: MOCK_MY_RIDES, appliedRides: MOCK_APPLIED_RIDES, reviews: MOCK_REVIEWS })
        setLoading(false)
      })
  }, [authUser])

  async function handleAccept(appId, rideId) {
    try {
      await api.patch(`/api/applications/${appId}`, { status: 'accepted' })
      const res = await api.get('/api/applications', { params: { ride_id: rideId } })
      setApplicants(prev => ({ ...prev, [rideId]: res.data }))
      alert('수락 완료! 잔여 좌석이 줄었어요.')
    } catch (err) {
      alert(err.response?.data?.error || '오류가 발생했어요.')
    }
  }

  async function handleReject(appId, rideId) {
    try {
      await api.patch(`/api/applications/${appId}`, { status: 'rejected' })
      const res = await api.get('/api/applications', { params: { ride_id: rideId } })
      setApplicants(prev => ({ ...prev, [rideId]: res.data }))
    } catch (err) {
      alert('오류가 발생했어요.')
    }
  }

  if (loading) return <div className="container py-5 text-center text-secondary">로딩 중...</div>

  const { nickname, student_id, manner_score, ride_count,
    myRides = MOCK_MY_RIDES,
    appliedRides = MOCK_APPLIED_RIDES,
    reviews = MOCK_REVIEWS } = userData || MOCK_USER

  const barPercent = Math.min(100, (manner_score / 50) * 100)
  const barColor = mannerBarColor(manner_score)

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
        뒤로가기
      </button>

      <h2 className="fs-5 fw-bold mb-4">내 프로필</h2>

      {/* 내 정보 카드 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{ width: 56, height: 56, fontSize: '1.4rem', background: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {nickname.charAt(0)}
              </div>
              <div>
                <p className="fw-bold fs-5 mb-0">{nickname}</p>
                <p className="text-secondary small mb-0">학번 {student_id}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm fw-semibold flex-shrink-0"
              onClick={() => console.log('프로필 수정 클릭')}
            >
              프로필 수정
            </button>
          </div>

          <hr className="my-3" />

          <div className="row g-3">
            <div className="col-6 text-center">
              <p className="text-secondary small mb-1">탑승 횟수</p>
              <p className="fw-bold fs-5 mb-0">{ride_count}회</p>
            </div>
            <div className="col-6">
              <p className="text-secondary small mb-1 text-center">
                매너 온도
                <span className="ms-1 fw-bold" style={{ color: barColor }}>
                  {manner_score.toFixed(1)}°
                </span>
              </p>
              <div
                className="rounded-pill overflow-hidden"
                style={{ height: 10, background: '#e9ecef' }}
                role="progressbar"
                aria-valuenow={manner_score}
                aria-valuemin={0}
                aria-valuemax={50}
              >
                <div
                  className="h-100 rounded-pill"
                  style={{
                    width: `${barPercent}%`,
                    background: barColor,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.65rem', color: '#adb5bd' }}>
                <span>0°</span>
                <span>36.5°</span>
                <span>50°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 내가 등록한 동승 목록 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h3 className="fs-6 fw-bold mb-3">내가 등록한 동승</h3>
          {myRides.length === 0 ? (
            <p className="text-secondary small mb-0 text-center py-2">등록한 동승이 없습니다.</p>
          ) : (
            MOCK_MY_RIDES.map((ride) => (
              <RideRowCard key={ride.id} ride={ride} />
            ))
          )}
        </div>
      </div>

      {/* 내가 신청한 동승 목록 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h3 className="fs-6 fw-bold mb-3">내가 신청한 동승</h3>
          {appliedRides.length === 0 ? (
            <p className="text-secondary small mb-0 text-center py-2">신청한 동승이 없습니다.</p>
          ) : (
            appliedRides.map((ride) => (
              <RideRowCard key={ride.id} ride={ride} />
            ))
          )}
        </div>
      </div>

      {/* 받은 후기 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h3 className="fs-6 fw-bold mb-3">받은 후기</h3>
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="p-3 rounded-3" style={{ background: 'var(--color-primary-bg)' }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-semibold small">{review.author}</span>
                  <div className="d-flex align-items-center gap-2">
                    <StarMini rating={review.rating} />
                    <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{review.date}</span>
                  </div>
                </div>
                <p className="small mb-0 text-secondary">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProfilePage
