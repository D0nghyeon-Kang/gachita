// server/routes/applications.js
// ─────────────────────────────────────────────────────────────
// 핵심 수정:
//   기존 코드가 status 변경 + 직접 filled_seats UPDATE를 둘 다 했음.
//   schema.sql의 트리거(trg_fill_seat, trg_free_seat)를 주석 처리했으므로
//   이 라우터에서 filled_seats를 직접 관리함 (중복 제거 완료).
//
//   POST /: status를 바로 'accepted'로 넣던 것을 'pending'으로 변경
//           → 모집자가 수락/거절할 수 있도록
// ─────────────────────────────────────────────────────────────
const express   = require('express');
const router    = express.Router();
const { getDb } = require('../db/db');

// POST /api/applications — 동승 신청
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { ride_id, applicant_id } = req.body;

    if (!ride_id || !applicant_id) {
      return res.status(400).json({ error: 'ride_id와 applicant_id가 필요합니다.' });
    }

    // 라이드 존재 및 상태 확인
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(ride_id);
    if (!ride) return res.status(404).json({ error: '라이드를 찾을 수 없습니다.' });
    if (ride.status !== 'open') return res.status(400).json({ error: '모집 중인 라이드가 아닙니다.' });

    // 호스트 본인 신청 방지
    if (ride.host_id === Number(applicant_id)) {
      return res.status(400).json({ error: '본인이 만든 라이드에는 신청할 수 없습니다.' });
    }

    // 중복 신청 방지
    const existing = db.prepare(
      "SELECT id FROM applications WHERE ride_id = ? AND applicant_id = ? AND status != 'cancelled'"
    ).get(ride_id, applicant_id);
    if (existing) return res.status(409).json({ error: '이미 신청한 라이드입니다.' });

    // 신청 생성 (pending 상태)
    const result = db.prepare(`
      INSERT INTO applications (ride_id, applicant_id, status) VALUES (?, ?, 'pending')
    `).run(ride_id, applicant_id);

    res.status(201).json({
      id:           result.lastInsertRowid,
      ride_id,
      applicant_id,
      status:       'pending',
      message:      '신청이 완료되었습니다. 모집자의 수락을 기다려주세요.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// PATCH /api/applications/:id — 신청 상태 변경 (수락/거절/취소)
router.patch('/:id', (req, res) => {
  try {
    const db = getDb();
    const { status } = req.body;
    const allowed = ['accepted', 'rejected', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: '올바르지 않은 상태입니다.' });
    }

    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!app) return res.status(404).json({ error: '신청을 찾을 수 없습니다.' });

    const prevStatus = app.status;
    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, req.params.id);

    // filled_seats 조정 (트리거를 주석처리했으므로 여기서만 관리)
    if (status === 'accepted' && prevStatus === 'pending') {
      db.prepare(`
        UPDATE rides
        SET filled_seats = filled_seats + 1,
            status = CASE WHEN filled_seats + 1 >= total_seats THEN 'closed' ELSE status END
        WHERE id = ?
      `).run(app.ride_id);
    }

    if ((status === 'rejected' || status === 'cancelled') && prevStatus === 'accepted') {
      db.prepare(`
        UPDATE rides
        SET filled_seats = MAX(1, filled_seats - 1),
            status = 'open'
        WHERE id = ?
      `).run(app.ride_id);
    }

    res.json({ success: true, id: Number(req.params.id), status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/applications?ride_id=1
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { ride_id } = req.query;
    if (!ride_id) return res.status(400).json({ error: 'ride_id가 필요합니다.' });

    const list = db.prepare(`
      SELECT a.*, u.nickname, u.manner_score, u.ride_count
      FROM applications a JOIN users u ON a.applicant_id = u.id
      WHERE a.ride_id = ?
      ORDER BY a.created_at ASC
    `).all(ride_id);

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;