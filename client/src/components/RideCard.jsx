function StarRating({ rating }) {
  return (
    <span className="ride-card__stars" aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill={star <= Math.round(rating) ? '#ffc107' : '#dee2e6'}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
      <span className="ride-card__rating-value ms-1">{rating.toFixed(1)}</span>
    </span>
  )
}

function RideCard({ ride }) {
  const { from, to, departureTime, seatsLeft, estimatedCost, rating } = ride

  const seatsColor =
    seatsLeft === 0
      ? 'text-danger'
      : seatsLeft <= 1
        ? 'text-warning'
        : 'text-success'

  return (
    <div className="card ride-card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column gap-2 p-3">

        {/* 출발지 → 목적지 */}
        <div className="d-flex align-items-center gap-2 fw-semibold fs-6">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1">
            {from}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-secondary flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
          <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1">
            {to}
          </span>
        </div>

        <hr className="my-0" />

        {/* 세부 정보 */}
        <ul className="list-unstyled mb-0 d-flex flex-column gap-1 small">
          <li className="d-flex justify-content-between">
            <span className="text-secondary">출발 시간</span>
            <span className="fw-medium">{departureTime}</span>
          </li>
          <li className="d-flex justify-content-between">
            <span className="text-secondary">잔여 좌석</span>
            <span className={`fw-semibold ${seatsColor}`}>
              {seatsLeft === 0 ? '마감' : `${seatsLeft}석`}
            </span>
          </li>
          <li className="d-flex justify-content-between">
            <span className="text-secondary">예상 비용</span>
            <span className="fw-medium">{estimatedCost.toLocaleString()}원</span>
          </li>
        </ul>

        {/* 하단: 별점 + 신청 버튼 */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <StarRating rating={rating} />
          <button
            className="btn btn-primary btn-sm px-3"
            disabled={seatsLeft === 0}
          >
            {seatsLeft === 0 ? '마감' : '신청하기'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default RideCard
