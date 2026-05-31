import RideCard from '../components/RideCard'

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
    driver: { name: '이준호', rating: 4.8, trips: 34, carModel: '현대 아반떼' },
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
    driver: { name: '박서연', rating: 4.5, trips: 21, carModel: '기아 K3' },
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
    driver: { name: '최민준', rating: 4.2, trips: 12, carModel: '쉐보레 스파크' },
  },
]

function MainPage() {
  return (
    <div className="container py-4 px-3">

      {/* 페이지 타이틀 */}
      <header className="mb-4">
        <p className="text-secondary small mb-0">지금 모집 중인 동승 목록이에요.</p>
      </header>

      {/* 검색/필터 바 */}
      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-white border-end-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-secondary" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" />
          </svg>
        </span>
        <input
          type="search"
          className="form-control border-start-0 ps-0"
          placeholder="출발지 또는 목적지 검색"
          aria-label="동승 검색"
        />
      </div>

      {/* 카드 목록 */}
      <div className="row g-3">
        {MOCK_RIDES.map((ride) => (
          <div key={ride.id} className="col-12 col-sm-6 col-lg-4">
            <RideCard ride={ride} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default MainPage
