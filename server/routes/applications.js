// server/routes/applications.js
const express = require('express')
const router  = express.Router()
const { getDb } = require('../db/db')

// ── POST /api/applications  (참여 신청하기)
// DetailPage의 handleApply() 에서 호출
router.post('/', (req, res) => {
  try {
    const db = getDb()
    const { ride_id, applicant_id } = req.body

    if (!ride_id || !applicant_id) {
      return res.status(400).json({ error: 'ride_id와 applicant_id가 필요해요.' })
    }

    // 해당 라이드 좌석 확인
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(ride_id)
    if (!ride) return res.status(404).json({ error: '동승 정보를 찾을 수 없어요.' })
    if (ride.status !== 'open') return res.status(400).json({ error: '이미 마감된 동승이에요.' })

    // 중복 신청 체크
    const existing = db.prepare(
      'SELECT id FROM applications WHERE ride_id = ? AND applicant_id = ?'
    ).get(ride_id, applicant_id)
    if (existing) return res.status(409).json({ error: '이미 신청한 동승이에요.' })

    const result = db.prepare(`
      INSERT INTO applications (ride_id, applicant_id, status) VALUES (?, ?, 'pending')
    `).run(ride_id, applicant_id)

    res.status(201).json({
      id: result.lastInsertRowid,
      ride_id,
      applicant_id,
      status: 'pending',
      message: '신청이 완료됐어요! 모집자가 수락하면 확정돼요.',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── PATCH /api/applications/:id  (수락/거절)
router.patch('/:id', (req, res) => {
  try {
    const db = getDb()
    const { status } = req.body
    const allowed = ['accepted', 'rejected', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: '유효하지 않은 상태값이에요.' })
    }

    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
    if (!app) return res.status(404).json({ error: '신청 정보를 찾을 수 없어요.' })

    const prevStatus = app.status
    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, req.params.id)

    // 수락 시 filled_seats +1
    if (status === 'accepted' && prevStatus === 'pending') {
      db.prepare(`
        UPDATE rides
        SET filled_seats = filled_seats + 1,
            status = CASE WHEN filled_seats + 1 >= total_seats THEN 'closed' ELSE status END
        WHERE id = ?
      `).run(app.ride_id)
    }

    // 수락 취소/거절 시 filled_seats -1
    if ((status === 'rejected' || status === 'cancelled') && prevStatus === 'accepted') {
      db.prepare(`
        UPDATE rides
        SET filled_seats = MAX(1, filled_seats - 1),
            status = 'open'
        WHERE id = ?
      `).run(app.ride_id)
    }

    res.json({ success: true, id: Number(req.params.id), status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── GET /api/applications?ride_id=1  (특정 라이드의 신청 목록)
router.get('/', (req, res) => {
  try {
    const db = getDb()
    const { ride_id } = req.query
    if (!ride_id) return res.status(400).json({ error: 'ride_id가 필요해요.' })

    const list = db.prepare(`
      SELECT a.*, u.nickname, u.manner_score, u.ride_count
      FROM applications a
      JOIN users u ON a.applicant_id = u.id
      WHERE a.ride_id = ?
      ORDER BY a.created_at ASC
    `).all(ride_id)

    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

module.exports = router
