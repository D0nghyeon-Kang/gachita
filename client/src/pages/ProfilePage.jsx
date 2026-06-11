import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const STATUS_MAP = {
  open:      { label: '모집중',  color: 'success' },
  closed:    { label: '마감',    color: 'warning' },
  completed: { label: '완료',    color: 'secondary' },
  cancelled: { label: '취소',    color: 'danger' },
}

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
        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="13" height="13"
          fill={s <= rating ? '#ffc107' : '#dee2e6'} viewBox="0 0 16 16" aria-hidden="true">
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
    <div className="card border-0 bg-light mb-2" style={{ cursor: 'pointer' }}
      role="button" tabIndex={0}
      onClick={() => navigate(`/rides/${id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/rides/${id}`)}>
      <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2 fw-semibold small flex-grow-1">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: 'var(--color-primary-bg)', color: 'var(--color-primary-dark)' }}>
            {origin}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-secondary flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: 'var(--color-primary-bg)', color: 'var(--color-primary-dark)' }}>
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
        // 내가 등록한 open 라이드의 신청자 목록 불러오기
        res.data.myRides?.forEach(ride => {
          if (ride.status === 'open') {
            api.get('/api/applications', { params: { ride_id: ride.id } })
              .then(r => setApplicants(prev => ({ ...prev, [ride.id]: r.data })))
              .catch(() => {})
          }
        })
      })
      .catch(() => {
        // API 실패 시 authUser 정보만 표시
        setUserData({
          nickname: authUser.nickname || '사용자',
          student_id: authUser.student_id || '',
          manner_score: authUser.manner_score || 36.5,
          ride_count: authUser.ride_count || 0,
          myRides: [],
          appliedRides: [],
          reviews: [],
        })
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

  const {
    nickname = '사용자',
    student_id = '',
    manner_score = 36.5,
    ride_count = 0,
    myRides = [],
    appliedRides = [],
    reviews = [],
  } = userData || {}

  const barPercent = Math.min(100, (manner_score / 50) * 100)
  const barColor = mannerBarColor(manner_score)

  return (
    <div className="container py-4 px-3" style={{ maxWidth: 600 }}>

      {/* 뒤로가기 */}
      <button
        className="btn btn-link ps-0 mb-3 text-secondary text-decoration-none d-flex align-items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{ width: 56, height: 56, fontSize: '1.4rem', background: 'var(--color-primary)' }}>
                {nickname.charAt(0)}
              </div>
              <div>
                <p className="fw-bold fs-5 mb-0">{nickname}</p>
                <p className="text-secondary small mb-0">학번 {student_id}</p>
              </div>
            </div>
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
                  {Number(manner_score).toFixed(1)}°
                </span>
              </p>
              <div className="rounded-pill overflow-hidden" style={{ height: 10, background: '#e9ecef' }}>
                <div className="h-100 rounded-pill" style={{ width: `${barPercent}%`, background: barColor, transition: 'width 0.4s ease' }} />
              </div>
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.65rem', color: '#adb5bd' }}>
                <span>0°</span><span>36.5°</span><span>50°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 내가 등록한 동승 */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h3 className="fs-6 fw-bold mb-3">내가 등록한 동승</h3>
          {myRides.length === 0 ? (
            <p className="text-secondary small mb-0 text-center py-2">등록한 동승이 없습니다.</p>
          ) : (
            myRides.map((ride) => (
              <div key={ride.id}>
                <RideRowCard ride={ride} />
                {/* 신청자 목록 + 수락/거절 */}
                {ride.status === 'open' && (
                  <div style={{ margin: '4px 0 12px', padding: '10px 12px', background: 'var(--color-primary-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    {!applicants[ride.id] ? (
                      <p className="small text-secondary mb-0">신청자 확인 중...</p>
                    ) : applicants[ride.id].length === 0 ? (
                      <p className="small text-secondary mb-0">아직 신청자가 없어요.</p>
                    ) : (
                      <>
                        <p className="small fw-semibold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
                          📋 신청자 {applicants[ride.id].length}명
                        </p>
                        {applicants[ride.id].map(app => (
                          <div key={app.id} className="d-flex align-items-center justify-content-between py-1">
                            <div>
                              <span className="small fw-semibold">{app.nickname}</span>
                              <span className="small text-secondary ms-2">⭐ {Number(app.manner_score).toFixed(1)}°</span>
                            </div>
                            <div className="d-flex gap-1">
                              {app.status === 'pending' ? (
                                <>
                                  <button onClick={() => handleAccept(app.id, ride.id)}
                                    style={{ padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, border: 'none', borderRadius: '20px', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer' }}>
                                    수락
                                  </button>
                                  <button onClick={() => handleReject(app.id, ride.id)}
                                    style={{ padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #dee2e6', borderRadius: '20px', background: '#fff', color: '#6c757d', cursor: 'pointer' }}>
                                    거절
                                  </button>
                                </>
                              ) : (
                                <span className={`badge ${app.status === 'accepted' ? 'bg-success' : 'bg-secondary'}`}>
                                  {app.status === 'accepted' ? '수락됨' : '거절됨'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 내가 신청한 동승 */}
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
          {reviews.length === 0 ? (
            <p className="text-secondary small mb-0 text-center py-2">받은 후기가 없습니다.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-3 rounded-3" style={{ background: 'var(--color-primary-bg)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-semibold small">{review.author || review.reviewer_nickname}</span>
                    <div className="d-flex align-items-center gap-2">
                      <StarMini rating={review.rating} />
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{review.date || review.created_at?.slice(0, 10)}</span>
                    </div>
                  </div>
                  <p className="small mb-0 text-secondary">{review.content || review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default ProfilePage
