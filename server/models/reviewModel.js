// server/models/reviewModel.js
// 컬럼명을 schema.sql 기준으로 통일:
//   rating (기존 코드: score → rating으로 스키마 변경)
//   comment (기존 코드: content → comment로 스키마 변경)
//   reviewee_id 추가
const db = require('../db/connection');

const reviewModel = {
  create({ ride_id, reviewer_id, reviewee_id, rating, comment }) {
    const info = db.prepare(`
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (@ride_id, @reviewer_id, @reviewee_id, @rating, @comment)
    `).run({ ride_id, reviewer_id, reviewee_id, rating, comment: comment ?? null });
    return db.prepare(`SELECT * FROM reviews WHERE id = ?`).get(info.lastInsertRowid);
  },

  findByRide(ride_id) {
    return db.prepare(`
      SELECT rv.*, u.nickname AS reviewer_nickname
      FROM reviews rv JOIN users u ON rv.reviewer_id = u.id
      WHERE rv.ride_id = ?
    `).all(ride_id);
  },

  findLogByUser(user_id) {
    return db.prepare(`
      SELECT * FROM manner_score_log WHERE user_id = ? ORDER BY created_at DESC
    `).all(user_id);
  },
};

module.exports = reviewModel;