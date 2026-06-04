// server/routes/users.js
const express = require('express')
const router  = express.Router()
const { getDb } = require('../db/db')

// ── GET /api/users/me  (ProfilePage — 내 정보)
// MOCK_USER: { nickname, student_id, manner_score, ride_count }
router.get('/me', (req, res) => {
  try {
    const db = getDb()
    // 로그인 전 임시: id=1 고정 (추후 JWT 미들웨어로 교체)
    const user_id = req.query.user_id || 1

    const user = db.prepare(`
      SELECT id, nickname, student_id, manner_score, ride_count, gender, created_at
      FROM users WHERE id = ?
    `).get(user_id)

    if (!user) return res.status(404).json({ error: '유저를 찾을 수 없어요.' })

    // 내가 등록한 동승 (MOCK_MY_RIDES)
    const myRides = db.prepare(`
      SELECT id, origin, destination, depart_at, status
      FROM rides WHERE host_id = ?
      ORDER BY created_at DESC
    `).all(user_id)

    // 내가 신청한 동승 (MOCK_APPLIED_RIDES)
    const appliedRides = db.prepare(`
      SELECT r.id, r.origin, r.destination, r.depart_at, r.status
      FROM applications a
      JOIN rides r ON a.ride_id = r.id
      WHERE a.applicant_id = ? AND a.status = 'accepted'
      ORDER BY a.created_at DESC
    `).all(user_id)

    // 받은 후기 (MOCK_REVIEWS)
    const reviews = db.prepare(`
      SELECT rev.id, rev.score as rating, rev.content, rev.created_at as date,
             u.nickname as author
      FROM reviews rev
      JOIN rides r ON rev.ride_id = r.id
      JOIN users u ON rev.reviewer_id = u.id
      WHERE r.host_id = ?
      ORDER BY rev.created_at DESC
    `).all(user_id)

    res.json({
      ...user,
      myRides,
      appliedRides,
      reviews: reviews.map(r => ({
        ...r,
        date: r.date ? r.date.slice(0, 10) : '',
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── GET /api/users/:id  (특정 유저 정보)
router.get('/:id', (req, res) => {
  try {
    const db = getDb()
    const user = db.prepare(`
      SELECT id, nickname, manner_score, ride_count FROM users WHERE id = ?
    `).get(req.params.id)

    if (!user) return res.status(404).json({ error: '유저를 찾을 수 없어요.' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── PATCH /api/users/me  (프로필 수정)
router.patch('/me', (req, res) => {
  try {
    const db = getDb()
    const { nickname, gender, user_id } = req.body
    const id = user_id || 1

    if (nickname) {
      db.prepare('UPDATE users SET nickname = ? WHERE id = ?').run(nickname, id)
    }
    if (gender) {
      db.prepare('UPDATE users SET gender = ? WHERE id = ?').run(gender, id)
    }

    const updated = db.prepare(
      'SELECT id, nickname, student_id, manner_score, ride_count FROM users WHERE id = ?'
    ).get(id)

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

module.exports = router
