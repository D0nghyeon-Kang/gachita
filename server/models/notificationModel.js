// server/models/notificationModel.js
// 기존 코드와 동일 — schema.sql에 notifications 테이블을 추가했으므로 이제 정상 동작
const db = require('../db/connection');

const notificationModel = {
  create({ user_id, ride_id, type, message }) {
    const info = db.prepare(`
      INSERT INTO notifications (user_id, ride_id, type, message)
      VALUES (@user_id, @ride_id, @type, @message)
    `).run({ user_id, ride_id: ride_id ?? null, type, message });
    return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(info.lastInsertRowid);
  },

  findByUser(user_id) {
    return db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY is_read ASC, created_at DESC
    `).all(user_id);
  },

  markRead(id, user_id) {
    db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`).run(id, user_id);
  },

  markAllRead(user_id) {
    db.prepare(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`).run(user_id);
  },
};

module.exports = notificationModel;