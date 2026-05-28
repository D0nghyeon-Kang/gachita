const db = require('../db/connection');

const reviewModel = {
  /** 후기 생성 (트리거가 manner_temp & log 자동 처리) */
  create({ ride_id, reviewer_id, reviewee_id, rating, comment }) {
    const info = db.prepare(`
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (@ride_id, @reviewer_id, @reviewee_id, @rating, @comment)
    `).run({ ride_id, reviewer_id, reviewee_id, rating, comment: comment ?? null });
    return db.prepare(`SELECT * FROM reviews WHERE id = ?`).get(info.lastInsertRowid);
  },

  /** 특정 라이드의 후기 목록 */
  findByRide(ride_id) {
    return db.prepare(`
      SELECT rv.*, u.nickname AS reviewer_nickname
      FROM reviews rv JOIN users u ON rv.reviewer_id = u.id
      WHERE rv.ride_id = ?
    `).all(ride_id);
  },

  /** 사용자의 매너 온도 이력 */
  findLogByUser(user_id) {
    return db.prepare(`
      SELECT * FROM manner_score_log WHERE user_id = ? ORDER BY created_at DESC
    `).all(user_id);
  },
};

module.exports = reviewModel;