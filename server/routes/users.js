// server/routes/users.js
// 수정 사항:
//   리뷰 조회 쿼리를 reviewee_id 기준으로 변경 (기존: r.host_id 기준)
//   → 내가 받은 리뷰를 정확하게 조회
const express   = require('express');
const router    = express.Router();
const { getDb } = require('../db/db');

// GET /api/users/me
router.get('/me', (req, res) => {
  try {
    const db      = getDb();
    const user_id = req.query.user_id || 1;

    const user = db.prepare(`
      SELECT id, nickname, student_id, manner_score, ride_count, gender, created_at
      FROM users WHERE id = ?
    `).get(user_id);
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

    // 내가 만든 라이드
    const myRides = db.prepare(`
      SELECT id, origin, destination, depart_at, status
      FROM rides WHERE host_id = ?
      ORDER BY created_at DESC
    `).all(user_id);

    // 내가 신청하여 수락된 라이드
    const appliedRides = db.prepare(`
      SELECT r.id, r.origin, r.destination, r.depart_at, r.status
      FROM applications a
      JOIN rides r ON a.ride_id = r.id
      WHERE a.applicant_id = ? AND a.status = 'accepted'
      ORDER BY a.created_at DESC
    `).all(user_id);

    // 내가 받은 리뷰 (reviewee_id 기준으로 변경)
    const reviews = db.prepare(`
      SELECT rv.id, rv.rating, rv.comment, rv.created_at as date,
             u.nickname as author
      FROM reviews rv
      JOIN users u ON rv.reviewer_id = u.id
      WHERE rv.reviewee_id = ?
      ORDER BY rv.created_at DESC
    `).all(user_id);

    res.json({
      ...user,
      myRides,
      appliedRides,
      reviews: reviews.map(r => ({ ...r, date: r.date ? r.date.slice(0, 10) : '' })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  try {
    const db   = getDb();
    const user = db.prepare(`
      SELECT id, nickname, manner_score, ride_count FROM users WHERE id = ?
    `).get(req.params.id);
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// PATCH /api/users/me
router.patch('/me', (req, res) => {
  try {
    const db            = getDb();
    const { nickname, gender, user_id } = req.body;
    const id            = user_id || 1;

    if (nickname) db.prepare('UPDATE users SET nickname = ? WHERE id = ?').run(nickname, id);
    if (gender)   db.prepare('UPDATE users SET gender   = ? WHERE id = ?').run(gender,   id);

    const updated = db.prepare(
      'SELECT id, nickname, student_id, manner_score, ride_count FROM users WHERE id = ?'
    ).get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;