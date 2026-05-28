const db = require('../db/connection');

const rideModel = {
  findAll({ status, keyword, gender_limit, has_seat, sort } = {}) {
    let query = `
      SELECT r.*, u.nickname AS host_nickname, u.manner_score AS host_manner_score,
             u.ride_count AS host_ride_count,
             ROUND(CAST(r.cost_total AS REAL) / r.total_seats) AS cost_per_person,
             (r.total_seats - r.filled_seats) AS remaining_seats
      FROM rides r
      JOIN users u ON r.host_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status)       { query += ` AND r.status = ?`;                              params.push(status); }
    if (keyword)      { query += ` AND (r.origin LIKE ? OR r.destination LIKE ?)`; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (gender_limit) { query += ` AND r.gender_limit IN ('any', ?)`;              params.push(gender_limit); }
    if (has_seat)     { query += ` AND r.filled_seats < r.total_seats`; }

    if (sort === 'cheap')     query += ` ORDER BY cost_per_person ASC`;
    else if (sort === 'soon') query += ` ORDER BY r.depart_at ASC`;
    else                      query += ` ORDER BY r.created_at DESC`;

    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT r.*, u.nickname AS host_nickname, u.manner_score AS host_manner_score,
             u.ride_count AS host_ride_count,
             ROUND(CAST(r.cost_total AS REAL) / r.total_seats) AS cost_per_person,
             (r.total_seats - r.filled_seats) AS remaining_seats
      FROM rides r JOIN users u ON r.host_id = u.id
      WHERE r.id = ?
    `).get(id);
  },

  create({ host_id, origin, destination, depart_at, total_seats, cost_total, gender_limit, luggage_ok, memo }) {
    const info = db.prepare(`
      INSERT INTO rides (host_id, origin, destination, depart_at, total_seats, cost_total, gender_limit, luggage_ok, memo)
      VALUES (@host_id, @origin, @destination, @depart_at, @total_seats, @cost_total, @gender_limit, @luggage_ok, @memo)
    `).run({
      host_id, origin, destination, depart_at, total_seats, cost_total,
      gender_limit: gender_limit ?? 'any',
      luggage_ok: luggage_ok ? 1 : 0,
      memo: memo ?? null,
    });
    return this.findById(info.lastInsertRowid);
  },

  update(id, host_id, fields) {
    const allowed = ['origin','destination','depart_at','total_seats','cost_total','gender_limit','luggage_ok','memo'];
    const sets = Object.keys(fields).filter(k => allowed.includes(k)).map(k => `${k} = @${k}`).join(', ');
    if (!sets) return null;
    db.prepare(`UPDATE rides SET ${sets} WHERE id = @id AND host_id = @host_id`)
      .run({ ...fields, id, host_id });
    return this.findById(id);
  },

  updateStatus(id, status) {
    db.prepare(`UPDATE rides SET status = ? WHERE id = ?`).run(status, id);
    return this.findById(id);
  },

  delete(id, host_id) {
    return db.prepare(`DELETE FROM rides WHERE id = ? AND host_id = ?`).run(id, host_id);
  },
};

module.exports = rideModel;