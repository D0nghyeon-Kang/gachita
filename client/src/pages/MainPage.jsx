import { useState, useEffect } from 'react'
import RideCard from '../components/RideCard'
import api from '../api/axios'

const MOCK_RIDES = [
  {
    id: 1,
    type: '카풀',
    origin: '기숙사',
    destination: '서울역',
    depart_at: '2026-06-03 08:30',
    total_seats: 4,
    filled_seats: 2,
    cost_total: 4500,
    rating: 4.8,
    driver: { name: '이준호', rating: 4.8, trips: 34, carModel: '현대 아반떼' },
  },
  {
    id: 2,
    type: '택시 동승',
    origin: '정문',
    destination: '강남역',
    depart_at: '2026-06-03 09:00',
    total_seats: 4,
    filled_seats: 3,
    cost_total: 7200,
    rating: 4.5,
    driver: { name: '박서연', rating: 4.5, trips: 21, carModel: '기아 K3' },
  },
  {
    id: 3,
    type: '카풀',
    origin: '후문',
    destination: '수원역',
    depart_at: '2026-06-03 10:15',
    total_seats: 4,
    filled_seats: 4,
    cost_total: 3800,
    rating: 4.2,
    driver: { name: '최민준', rating: 4.2, trips: 12, carModel: '쉐보레 스파크' },
  },
  {
    id: 4,
    type: '택시 동승',
    origin: '기숙사',
    destination: '강남역',
    depart_at: '2026-06-03 11:00',
    total_seats: 3,
    filled_seats: 1,
    cost_total: 8500,
    rating: 4.9,
    driver: { name: '김지수', rating: 4.9, trips: 56, carModel: '현대 쏘나타' },
  },
  {
    id: 5,
    type: '카풀',
    origin: '정문',
    destination: '천안역',
    depart_at: '2026-06-03 13:30',
    total_seats: 4,
    filled_seats: 2,
    cost_total: 5000,
    rating: 4.6,
    driver: { name: '윤태양', rating: 4.6, trips: 28, carModel: '기아 스포티지' },
  },
  {
    id: 6,
    type: '택시 동승',
    origin: '후문',
    destination: '판교역',
    depart_at: '2026-06-03 18:00',
    total_seats: 4,
    filled_seats: 1,
    cost_total: 9200,
    rating: 4.7,
    driver: { name: '임하은', rating: 4.7, trips: 43, carModel: '현대 그랜저' },
  },
]

const POPULAR_ROUTES = [
  { id: 1, origin: '기숙사', destination: '강남역', count: 32, emoji: '🏙️' },
  { id: 2, origin: '정문', destination: '수원역', count: 27, emoji: '🚉' },
  { id: 3, origin: '후문', destination: '서울역', count: 24, emoji: '🗼' },
  { id: 4, origin: '기숙사', destination: '천안역', count: 18, emoji: '🌳' },
]

const FILTER_TABS = ['전체', '카풀', '택시 동승']

const SORT_OPTIONS = ['최신순', '출발 임박순', '가격 낮은순']

const STEPS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
      </svg>
    ),
    step: '01',
    title: '동승 등록하기',
    desc: '출발지, 목적지, 시간을 입력해 동승 모집글을 올려요.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
      </svg>
    ),
    step: '02',
    title: '매칭하기',
    desc: '원하는 동승 글을 찾아 신청하거나, 내 글에 신청자를 수락해요.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.227.531.35 1.102.35 1.684V12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H2v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.047c0-.582.123-1.153.35-1.684zm-1.5 7.065.5 1H14l.5-1H1.02zM14 7.519l-.427-1H2.427L2 7.52V9h12V7.52z"/>
        <path d="M2.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      </svg>
    ),
    step: '03',
    title: '함께 이동',
    desc: '매칭 완료 후 약속 장소에서 만나 함께 이동하고 후기를 남겨요.',
  },
]

function MainPage() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('전체')
  const [sort, setSort] = useState('최신순')
  const [searchOrigin, setSearchOrigin] = useState('')

  useEffect(() => {
    document.title = '같이타 - 메인'
  }, [])
  const [searchDest, setSearchDest] = useState('')
  const [appliedOrigin, setAppliedOrigin] = useState('')
  const [appliedDest, setAppliedDest] = useState('')

  useEffect(() => {
    document.title = '같이타 - 메인'
  }, [])

  // ── 서버에서 라이드 목록 불러오기 ──
  useEffect(() => {
    fetchRides()
  }, [activeFilter, sort, appliedOrigin, appliedDest])

  async function fetchRides() {
    setLoading(true)
    try {
      const params = {}
      if (activeFilter !== '전체') params.type = activeFilter
      if (sort !== '최신순') params.sort = sort
      if (appliedOrigin) params.origin = appliedOrigin
      if (appliedDest) params.destination = appliedDest
      const res = await api.get('/api/rides', { params })
      setRides(res.data)
    } catch (err) {
      console.error('라이드 목록 불러오기 실패:', err)
      setRides(MOCK_RIDES) // 서버 꺼져 있으면 MOCK으로 대체
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    setAppliedOrigin(searchOrigin.trim())
    setAppliedDest(searchDest.trim())
  }

  const filtered = rides

  return (
    <main style={{ background: 'var(--color-bg)' }}>

      {/* ── 히어로 배너 ── */}
      <section style={{
        background: 'linear-gradient(160deg, #ECFDF5 0%, #D1FAE5 100%)',
        padding: '56px 0 48px',
        borderBottom: '1px solid rgba(16,185,129,0.12)',
      }}>
        <div className="container">
          <div style={{ maxWidth: '600px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              background: 'rgba(16,185,129,0.12)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              marginBottom: '16px',
              letterSpacing: '0.02em',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
              </svg>
              단국대학교 캠퍼스 카풀 서비스
            </span>

            <h1 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.25,
              letterSpacing: '-0.04em',
              marginBottom: '12px',
            }}>
              함께 이동하면<br />
              <span style={{ color: 'var(--color-primary)' }}>비용은 반</span>,
              즐거움은 배로
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'var(--color-text-sub)',
              marginBottom: '28px',
              lineHeight: 1.7,
            }}>
              단국대 학생들을 위한 카풀 및 택시 동승 매칭 플랫폼
            </p>

            {/* 검색바 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '8px',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--color-primary)" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg>
                <input
                  type="text"
                  placeholder="출발지 (예: 기숙사, 정문)"
                  value={searchOrigin}
                  onChange={(e) => setSearchOrigin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: 'var(--color-text)',
                    background: 'transparent',
                  }}
                />
              </div>
              <div style={{
                width: '1px',
                background: 'var(--color-border)',
                margin: '4px 0',
              }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--color-text-sub)" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
                <input
                  type="text"
                  placeholder="목적지 (예: 강남역, 수원역)"
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: 'var(--color-text)',
                    background: 'transparent',
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 필터 + 정렬 ── */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '0' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between" style={{ padding: '12px 0', gap: '12px' }}>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 'var(--radius-pill)',
                    border: activeFilter === tab
                      ? '1.5px solid var(--color-primary)'
                      : '1.5px solid var(--color-border)',
                    background: activeFilter === tab ? 'var(--color-primary)' : 'transparent',
                    color: activeFilter === tab ? '#FFFFFF' : 'var(--color-text-sub)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                background: '#FFFFFF',
                color: 'var(--color-text-sub)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 카드 목록 ── */}
      <section style={{ padding: '32px 0' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              지금 모집 중
              <span style={{
                marginLeft: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'rgba(16,185,129,0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
              }}>
                {filtered.length}개
              </span>
            </h2>
          </div>
          <div className="row g-3">
            {filtered.length === 0 ? (
              <div className="col-12 text-center py-5" style={{ color: 'var(--color-text-sub)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                <p style={{ fontWeight: 600 }}>검색 결과가 없어요.</p>
                <p style={{ fontSize: '0.875rem' }}>출발지·목적지를 다시 확인해보세요.</p>
              </div>
            ) : (
              filtered.map((ride) => (
                <div key={ride.id} className="col-12 col-sm-6 col-lg-4">
                  <RideCard ride={ride} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 이번 주 인기 경로 ── */}
      <section style={{ padding: '32px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2 mb-4">
            <span style={{ fontSize: '1.1rem' }}>🔥</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              이번 주 인기 경로
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {POPULAR_ROUTES.map((route) => (
              <div
                key={route.id}
                style={{
                  flexShrink: 0,
                  minWidth: '180px',
                  background: 'var(--color-bg)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 2px 6px rgba(16,185,129,0.06)',
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{route.emoji}</div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--color-text)',
                  marginBottom: '4px',
                }}>
                  {route.origin} → {route.destination}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  이번 주 {route.count}건
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 이용 통계 ── */}
      <section style={{ padding: '40px 0', background: 'linear-gradient(160deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px', textAlign: 'center' }}>
            같이타와 함께한 순간들
          </h2>
          <div className="row g-3 justify-content-center">
            {[
              { label: '누적 이용자', value: '1,234명', icon: '👥' },
              { label: '완료된 동승', value: '856건', icon: '✅' },
              { label: '절약된 비용', value: '28만원', icon: '💰' },
            ].map((stat) => (
              <div key={stat.label} className="col-12 col-sm-4">
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid rgba(16,185,129,0.12)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section style={{ padding: '48px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>
              이용 방법
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)' }}>
              3단계로 간단하게 동승 매칭을 완료하세요
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {STEPS.map((item, i) => (
              <div key={item.step} className="col-12 col-sm-4" style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary-bg), var(--color-primary-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-dark)',
                    margin: '0 auto',
                    border: '2px solid rgba(16,185,129,0.2)',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {item.step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="d-none d-sm-block" style={{
                    position: 'absolute',
                    top: '32px',
                    right: '-16px',
                    color: 'var(--color-primary-light)',
                    fontSize: '1.2rem',
                  }}>
                  </div>
                )}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer style={{
        background: 'var(--color-text)',
        color: 'rgba(255,255,255,0.6)',
        padding: '32px 0',
        marginTop: 'auto',
      }}>
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--color-primary)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.227.531.35 1.102.35 1.684V12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H2v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.047c0-.582.123-1.153.35-1.684zm-1.5 7.065.5 1H14l.5-1H1.02zM14 7.519l-.427-1H2.427L2 7.52V9h12V7.52z"/>
                  <path d="M2.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </span>
              <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                같이타
              </span>
              <span style={{ fontSize: '0.75rem' }}>×</span>
              <span style={{ fontSize: '0.85rem' }}>단국대학교</span>
            </div>
            <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.8rem' }}>
              <a
                href="https://github.com/D0nghyeon-Kang/gachita"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
                GitHub
              </a>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}

export default MainPage
