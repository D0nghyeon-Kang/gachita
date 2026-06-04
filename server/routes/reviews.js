// server/routes/reviews.js
const express = require('express')
const router  = express.Router()
const { getDb } = require('../db/db')

// ── POST /api/reviews  (후기 제출)
// ReviewPage의 handleSubmit: { rideId: Number(id), rating, text }
router.post('/', (req, res) => {
  try {
    const db = getDb()
    const { rideId, rating, text, reviewer_id } = req.body

    if (!rideId || !rating) {
      return res.status(400).json({ error: 'rideId와 rating은 필수예요.' })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '별점은 1~5 사이여야 해요.' })
    }

    // 해당 라이드가 완료 상태인지 확인
    const ride = db.prepare('SELECT status FROM rides WHERE id = ?').get(rideId)
    if (!ride) return res.status(404).json({ error: '동승 정보를 찾을 수 없어요.' })
    if (ride.status !== 'completed') {
      return res.status(400).json({ error: '완료된 동승에만 후기를 남길 수 있어요.' })
    }

    // 중복 후기 체크
    const existing = db.prepare(
      'SELECT id FROM reviews WHERE ride_id = ? AND reviewer_id = ?'
    ).get(rideId, reviewer_id || 1)
    if (existing) return res.status(409).json({ error: '이미 후기를 작성했어요.' })

    const result = db.prepare(`
      INSERT INTO reviews (ride_id, reviewer_id, score, content)
      VALUES (?, ?, ?, ?)
    `).run(rideId, reviewer_id || 1, rating, text || null)
    // trg_manner_score 트리거가 manner_score + ride_count 자동 갱신

    res.status(201).json({
      id: result.lastInsertRowid,
      rideId,
      rating,
      text: text || null,
      message: '후기가 등록됐어요!',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── GET /api/reviews?user_id=1  (특정 유저가 받은 후기)
router.get('/', (req, res) => {
  try {
    const db = getDb()
    const { user_id } = req.query

    const reviews = db.prepare(`
      SELECT rev.id, rev.score as rating, rev.content as content,
             rev.created_at, u.nickname as author
      FROM reviews rev
      JOIN rides r ON rev.ride_id = r.id
      JOIN users u ON rev.reviewer_id = u.id
      WHERE r.host_id = ?
      ORDER BY rev.created_at DESC
    `).all(user_id || 1)

    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

module.exports = router
