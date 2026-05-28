const db = require('../db/connection');

const userModel = {
  findByStudentId(student_id) {
    return db.prepare('SELECT * FROM users WHERE student_id = ?').get(student_id);
  },

  findById(id) {
    return db.prepare(
      'SELECT id, student_id, nickname, gender, manner_score, ride_count, created_at FROM users WHERE id = ?'
    ).get(id);
  },

  create({ student_id, nickname, password_hash, gender }) {
    const info = db.prepare(`
      INSERT INTO users (student_id, nickname, password_hash, gender)
      VALUES (@student_id, @nickname, @password_hash, @gender)
    `).run({ student_id, nickname, password_hash, gender });
    return this.findById(info.lastInsertRowid);
  },
};

module.exports = userModel;