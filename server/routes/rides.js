// server/routes/rides.js
const express    = require('express')
const router     = express.Router()
const jwt        = require('jsonwebtoken')
const { getDb }  = require('../db/db')

const JWT_SECRET = process.env.JWT_SECRET || 'gachita-dev-secret'

function extractUserId(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET).id
  } catch {
    return null
  }
}

// ── GET /api/rides  (메인페이지 목록)
// 쿼리: ?type=카풀&origin=기숙사&destination=강남역&sort=latest
router.get('/', (req, res) => {
  try {
    const db = getDb()
    const { type, origin, destination, sort } = req.query

    let sql = `
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating, u.ride_count as driver_trips
      FROM rides r
      JOIN users u ON r.host_id = u.id
      WHERE r.status IN ('open', 'closed')
    `
    const params = []

    // 필터
    if (type === '카풀') { sql += ' AND r.ride_type = ?'; params.push('carpool') }
    if (type === '택시 동승') { sql += ' AND r.ride_type = ?'; params.push('taxi') }
    if (origin)      { sql += ' AND r.origin LIKE ?';      params.push(`%${origin}%`) }
    if (destination) { sql += ' AND r.destination LIKE ?'; params.push(`%${destination}%`) }

    // 정렬
    if (sort === '출발 임박순') sql += ' ORDER BY r.depart_at ASC'
    else if (sort === '가격 낮은순') sql += ' ORDER BY r.cost_total ASC'
    else sql += ' ORDER BY r.created_at DESC'  // 기본: 최신순

    const rows = db.prepare(sql).all(...params)

    // 프론트 MOCK_RIDES 구조에 맞춰 변환
    const rides = rows.map(formatRide)
    res.json(rides)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── GET /api/rides/:id  (상세 페이지)
router.get('/:id', (req, res) => {
  try {
    const db = getDb()
    const row = db.prepare(`
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating,
             u.ride_count as driver_trips, u.gender as driver_gender
      FROM rides r
      JOIN users u ON r.host_id = u.id
      WHERE r.id = ?
    `).get(req.params.id)

    if (!row) return res.status(404).json({ error: '해당 동승 정보를 찾을 수 없어요.' })

    res.json(formatRide(row))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── POST /api/rides  (글쓰기 등록)
router.post('/', (req, res) => {
  try {
    const db = getDb()
    const host_id = extractUserId(req)
    if (!host_id) return res.status(401).json({ error: '로그인이 필요합니다.' })

    const {
      from, to,
      departureDate, departureTime,
      seats, estimatedCost,
      rideType, genderRestriction, hasLuggage, memo,
    } = req.body

    if (!from || !to || !departureDate || !departureTime || !seats || !estimatedCost) {
      return res.status(400).json({ error: '필수 항목을 모두 입력해주세요.' })
    }

    const depart_at = `${departureDate} ${departureTime}`

    const result = db.prepare(`
      INSERT INTO rides
        (host_id, origin, destination, depart_at, total_seats, cost_total,
         ride_type, gender_restriction, has_luggage, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      host_id,
      from, to, depart_at,
      Number(seats),
      Number(estimatedCost),
      rideType === 'taxi' ? 'taxi' : 'carpool',
      genderRestriction || 'any',
      hasLuggage ? 1 : 0,
      memo || null
    )

    const newRide = db.prepare(`
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating,
             u.ride_count as driver_trips
      FROM rides r JOIN users u ON r.host_id = u.id
      WHERE r.id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json(formatRide(newRide))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── PATCH /api/rides/:id/status  (상태 변경: 완료, 취소)
router.patch('/:id/status', (req, res) => {
  try {
    const db = getDb()
    const { status } = req.body
    const allowed = ['open', 'closed', 'completed', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: '유효하지 않은 상태값이에요.' })
    }
    db.prepare('UPDATE rides SET status = ? WHERE id = ?').run(status, req.params.id)
    res.json({ success: true, status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── 프론트 MOCK_RIDES 구조로 변환하는 헬퍼 ──
function formatRide(row) {
  return {
    id: row.id,
    type: row.ride_type === 'taxi' ? '택시 동승' : '카풀',
    origin: row.origin,
    destination: row.destination,
    depart_at: row.depart_at,
    total_seats: row.total_seats,
    filled_seats: row.filled_seats,
    cost_total: row.cost_total,
    rating: parseFloat((row.driver_rating || 36.5).toFixed(1)),
    status: row.status,
    gender_restriction: row.gender_restriction,
    has_luggage: row.has_luggage === 1,
    memo: row.memo,
    driver: {
      name: row.driver_name,
      rating: parseFloat((row.driver_rating || 36.5).toFixed(1)),
      trips: row.driver_trips || 0,
      carModel: row.car_model || '차량 정보 없음',
    },
  }
}

module.exports = router
