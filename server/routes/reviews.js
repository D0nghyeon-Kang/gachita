// server/routes/reviews.js
// 수정 사항:
//   기존 코드가 score/content 컬럼명을 썼는데
//   schema.sql을 rating/comment로 통일했으므로 맞춰서 수정.
//   reviewee_id 필드도 추가 (누구에 대한 리뷰인지 저장).
const express   = require('express');
const router    = express.Router();
const { getDb } = require('../db/db');

// POST /api/reviews
// ReviewPage에서 보내는 필드: rideId, rating, text, reviewer_id
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { rideId, rating, text, reviewer_id, reviewee_id } = req.body;

    if (!rideId || !rating) {
      return res.status(400).json({ error: 'rideId와 rating이 필요합니다.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '별점은 1~5 사이여야 합니다.' });
    }

    // 라이드 완료 여부 확인
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(rideId);
    if (!ride) return res.status(404).json({ error: '라이드를 찾을 수 없습니다.' });
    if (ride.status !== 'completed') {
      return res.status(400).json({ error: '완료된 라이드에만 리뷰를 작성할 수 있습니다.' });
    }

    // 중복 리뷰 방지
    const existing = db.prepare(
      'SELECT id FROM reviews WHERE ride_id = ? AND reviewer_id = ?'
    ).get(rideId, reviewer_id || 1);
    if (existing) return res.status(409).json({ error: '이미 리뷰를 작성했습니다.' });

    // reviewee_id가 없으면 라이드 호스트를 대상으로
    const target_reviewee = reviewee_id || ride.host_id;

    const result = db.prepare(`
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(rideId, reviewer_id || 1, target_reviewee, rating, text || null);

    // trg_manner_score 트리거가 reviewee의 manner_score를 자동으로 업데이트함

    res.status(201).json({
      id:      result.lastInsertRowid,
      rideId,
      rating,
      comment: text || null,
      message: '리뷰가 등록되었습니다.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/reviews?user_id=1
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { user_id } = req.query;

    const reviews = db.prepare(`
      SELECT rv.id, rv.rating, rv.comment,
             rv.created_at, u.nickname as author
      FROM reviews rv
      JOIN users u ON rv.reviewer_id = u.id
      WHERE rv.reviewee_id = ?
      ORDER BY rv.created_at DESC
    `).all(user_id || 1);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
