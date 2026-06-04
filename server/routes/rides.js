// server/routes/rides.js
const express   = require('express');
const router    = express.Router();
const { getDb } = require('../db/db');

// GET /api/rides
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { type, origin, destination, sort } = req.query;

    let sql = `
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating, u.ride_count as driver_trips
      FROM rides r
      JOIN users u ON r.host_id = u.id
      WHERE r.status IN ('open', 'closed')
    `;
    const params = [];

    if (type === '카풀') { sql += ' AND r.ride_type = ?'; params.push('carpool'); }
    if (type === '택시') { sql += ' AND r.ride_type = ?'; params.push('taxi'); }
    if (origin)          { sql += ' AND r.origin LIKE ?';       params.push(`%${origin}%`); }
    if (destination)     { sql += ' AND r.destination LIKE ?';  params.push(`%${destination}%`); }

    if (sort === '출발임박')    sql += ' ORDER BY r.depart_at ASC';
    else if (sort === '비용낮은순') sql += ' ORDER BY r.cost_total ASC';
    else                         sql += ' ORDER BY r.created_at DESC';

    const rows = db.prepare(sql).all(...params);
    res.json(rows.map(formatRide));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/rides/:id
router.get('/:id', (req, res) => {
  try {
    const db  = getDb();
    const row = db.prepare(`
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating,
             u.ride_count as driver_trips, u.gender as driver_gender
      FROM rides r JOIN users u ON r.host_id = u.id
      WHERE r.id = ?
    `).get(req.params.id);

    if (!row) return res.status(404).json({ error: '라이드를 찾을 수 없습니다.' });
    res.json(formatRide(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/rides
// WritePage에서 보내는 필드: from, to, departureDate, departureTime,
//   seats, estimatedCost, rideType, genderRestriction, hasLuggage, memo
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const {
      from, to,
      departureDate, departureTime,
      seats, estimatedCost,
      rideType, genderRestriction, hasLuggage, memo,
      host_id,
    } = req.body;

    if (!from || !to || !departureDate || !departureTime || !seats || !estimatedCost) {
      return res.status(400).json({ error: '필수 항목을 모두 입력해주세요.' });
    }

    const depart_at = `${departureDate} ${departureTime}`;

    const result = db.prepare(`
      INSERT INTO rides
        (host_id, origin, destination, depart_at, total_seats, cost_total,
         ride_type, gender_restriction, has_luggage, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      host_id || 1,
      from, to, depart_at,
      Number(seats),
      Number(estimatedCost),
      rideType === 'taxi' ? 'taxi' : 'carpool',
      genderRestriction || 'any',
      hasLuggage ? 1 : 0,
      memo || null
    );

    const newRide = db.prepare(`
      SELECT r.*, u.nickname as driver_name, u.manner_score as driver_rating,
             u.ride_count as driver_trips
      FROM rides r JOIN users u ON r.host_id = u.id
      WHERE r.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(formatRide(newRide));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// PATCH /api/rides/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const db = getDb();
    const { status } = req.body;
    const allowed = ['open', 'closed', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: '올바르지 않은 상태입니다.' });
    }

    db.prepare('UPDATE rides SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 응답 포맷 통일
function formatRide(row) {
  return {
    id:                 row.id,
    type:               row.ride_type === 'taxi' ? '택시' : '카풀',
    origin:             row.origin,
    destination:        row.destination,
    depart_at:          row.depart_at,
    total_seats:        row.total_seats,
    filled_seats:       row.filled_seats,
    cost_total:         row.cost_total,
    status:             row.status,
    gender_restriction: row.gender_restriction,
    has_luggage:        row.has_luggage === 1,
    memo:               row.memo,
    driver: {
      name:     row.driver_name,
      rating:   parseFloat((row.driver_rating || 36.5).toFixed(1)),
      trips:    row.driver_trips || 0,
      carModel: row.car_model || '정보 없음',
    },
  };
}

module.exports = router;