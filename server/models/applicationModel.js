// server/models/applicationModel.js
const db = require('../db/connection');

const applicationModel = {
  create(ride_id, applicant_id) {
    const info = db.prepare(`
      INSERT INTO applications (ride_id, applicant_id) VALUES (?, ?)
    `).run(ride_id, applicant_id);
    return this.findById(info.lastInsertRowid);
  },

  findById(id) {
    return db.prepare(`SELECT * FROM applications WHERE id = ?`).get(id);
  },

  findByRide(ride_id) {
    return db.prepare(`
      SELECT a.*, u.nickname, u.manner_score, u.ride_count, u.gender
      FROM applications a JOIN users u ON a.applicant_id = u.id
      WHERE a.ride_id = ?
      ORDER BY a.created_at ASC
    `).all(ride_id);
  },

  updateStatus(id, status) {
    db.prepare(`UPDATE applications SET status = ? WHERE id = ?`).run(status, id);
    return this.findById(id);
  },

  findDuplicate(ride_id, applicant_id) {
    return db.prepare(`
      SELECT * FROM applications WHERE ride_id = ? AND applicant_id = ? AND status != 'cancelled'
    `).get(ride_id, applicant_id);
  },
};

module.exports = applicationModel;