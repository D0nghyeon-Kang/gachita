import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  overflow: 'hidden',
}

const cardHoverStyle = {
  transform: 'translateY(-4px)',
  boxShadow: 'var(--shadow-card-hover)',
}

function StarRating({ rating }) {
  return (
    <span className="d-flex align-items-center gap-1" aria-label={`별점 ${rating}점`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#F59E0B" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-sub)' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}

function RideCard({ ride }) {
  const { origin, destination, depart_at, total_seats, filled_seats, cost_total, rating, type } = ride
  const navigate = useNavigate()
  const seatsLeft = total_seats - filled_seats

  const seatColor =
    seatsLeft === 0
      ? 'var(--color-seat-full)'
      : seatsLeft <= 1
        ? 'var(--color-seat-warn)'
        : 'var(--color-seat-ok)'

  const seatBg =
    seatsLeft === 0
      ? 'rgba(239,68,68,0.08)'
      : seatsLeft <= 1
        ? 'rgba(245,158,11,0.08)'
        : 'rgba(16,185,129,0.08)'

  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ ...cardStyle, ...(hovered ? cardHoverStyle : {}) }}
      onClick={() => navigate(`/rides/${ride.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/rides/${ride.id}`)}
      aria-label={`${origin}에서 ${destination} 동승 상세 보기`}
    >
      <div style={{ padding: '16px' }}>

        {/* 유형 배지 + 경로 */}
        <div className="d-flex align-items-center gap-2 mb-3">
          {type && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              background: type === '카풀' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
              color: type === '카풀' ? 'var(--color-primary-dark)' : '#4F46E5',
              letterSpacing: '0',
            }}>
              {type}
            </span>
          )}
          <div className="d-flex align-items-center gap-2" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', flex: 1 }}>
            <span>{origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--color-primary)" viewBox="0 0 16 16" aria-hidden="true">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
            <span>{destination}</span>
          </div>
        </div>

        {/* 세부 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <InfoRow label="출발 시간" value={depart_at} />
          <InfoRow
            label="잔여 좌석"
            value={
              <span style={{
                fontWeight: 700,
                color: seatColor,
                background: seatBg,
                padding: '1px 8px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
              }}>
                {seatsLeft === 0 ? '마감' : `${seatsLeft}석 남음`}
              </span>
            }
          />
          <InfoRow label="예상 비용" value={`${cost_total.toLocaleString()}원`} bold />
        </div>

        {/* 하단 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <StarRating rating={rating} />
          <button
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              cursor: seatsLeft === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              background: seatsLeft === 0
                ? 'rgba(100,116,139,0.1)'
                : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              color: seatsLeft === 0 ? 'var(--color-text-muted)' : '#FFFFFF',
              boxShadow: seatsLeft === 0 ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
            }}
            disabled={seatsLeft === 0}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/rides/${ride.id}`)
            }}
          >
            {seatsLeft === 0 ? '마감' : '신청하기'}
          </button>
        </div>

      </div>
    </div>
  )
}

function InfoRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: bold ? 700 : 500, color: 'var(--color-text)' }}>
        {value}
      </span>
    </div>
  )
}

export default RideCard
