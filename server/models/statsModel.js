const db = require('../db/connection');

const statsModel = {
  /** 요일별·시간대별 인기 경로 Top 5 */
  popularRoutes() {
    return db.prepare(`
      SELECT origin, destination,
             COUNT(*) AS count,
             ROUND(AVG(cost_total / total_seats)) AS avg_cost
      FROM rides
      WHERE status = 'completed'
      GROUP BY origin, destination
      ORDER BY count DESC
      LIMIT 5
    `).all();
  },

  /** 사용자 절약 금액 계산 */
  userSavings(user_id) {
    return db.prepare(`
      SELECT
        COUNT(*) AS total_rides,
        SUM(ROUND(CAST(r.cost_total AS REAL) / r.total_seats)) AS total_saved
      FROM applications a
      JOIN rides r ON a.ride_id = r.id
      WHERE a.applicant_id = ? AND a.status = 'accepted' AND r.status = 'completed'
    `).get(user_id);
  },

  /** 전체 완료 동승 건수 */
  totalCompleted() {
    return db.prepare(`SELECT COUNT(*) AS count FROM rides WHERE status = 'completed'`).get();
  },
};

module.exports = statsModel;