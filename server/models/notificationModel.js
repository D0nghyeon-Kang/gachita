const db = require('../db/connection');

const notificationModel = {
  /** 알림 생성 */
  create({ user_id, ride_id, type, message }) {
    const info = db.prepare(`
      INSERT INTO notifications (user_id, ride_id, type, message)
      VALUES (@user_id, @ride_id, @type, @message)
    `).run({ user_id, ride_id: ride_id ?? null, type, message });
    return db.prepare(`SELECT * FROM notifications WHERE id = ?`).get(info.lastInsertRowid);
  },

  /** 사용자 알림 목록 (미읽음 우선) */
  findByUser(user_id) {
    return db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY is_read ASC, created_at DESC
    `).all(user_id);
  },

  /** 알림 읽음 처리 */
  markRead(id, user_id) {
    db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`).run(id, user_id);
  },

  /** 전체 읽음 처리 */
  markAllRead(user_id) {
    db.prepare(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`).run(user_id);
  },
};

module.exports = notificationModel;