// server/db/seed.js
// 실행: node server/db/seed.js

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt    = require('bcrypt');
const { getDb } = require('./db');

const db = getDb();

// ─── 기존 데이터 전부 초기화 ───────────────────────────────
db.prepare('DELETE FROM manner_score_log').run();
db.prepare('DELETE FROM notifications').run();
db.prepare('DELETE FROM reviews').run();
db.prepare('DELETE FROM applications').run();
db.prepare('DELETE FROM rides').run();
db.prepare('DELETE FROM users').run();

for (const t of ['manner_score_log','notifications','reviews','applications','rides','users']) {
  db.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(t);
}

// ─── 유저 삽입 ────────────────────────────────────────────
// bcrypt 해싱 (saltRounds=10)
// 개발용 공통 비밀번호: password123
const SALT_ROUNDS = 10;

const insertUser = db.prepare(`
  INSERT INTO users (student_id, password_hash, nickname, gender, manner_score, ride_count)
  VALUES (@student_id, @password_hash, @nickname, @gender, @manner_score, @ride_count)
`);

// bcrypt.hashSync: seed는 서버 시작과 무관하게 한 번만 실행되므로 sync 사용
const users = [
  { student_id: '2021001', nickname: '김민준', gender: 'male',   manner_score: 48.0, ride_count: 34 },
  { student_id: '2021002', nickname: '이지은', gender: 'female', manner_score: 45.0, ride_count: 21 },
  { student_id: '2021003', nickname: '박준서', gender: 'male',   manner_score: 42.0, ride_count: 12 },
  { student_id: '2021004', nickname: '최서연', gender: 'female', manner_score: 49.0, ride_count: 56 },
  { student_id: '2021005', nickname: '정우진', gender: 'male',   manner_score: 46.0, ride_count: 28 },
  { student_id: '2021006', nickname: '강하은', gender: 'female', manner_score: 47.0, ride_count: 43 },
].map(u => ({
  ...u,
  password_hash: bcrypt.hashSync('password123', SALT_ROUNDS),
}));

const insertUsers = db.transaction(() => users.forEach(u => insertUser.run(u)));
insertUsers();

// ID 매핑
const userMap = Object.fromEntries(
  db.prepare('SELECT id, nickname FROM users').all().map(u => [u.nickname, u.id])
);

// ─── 라이드 삽입 ──────────────────────────────────────────
const insertRide = db.prepare(`
  INSERT INTO rides
    (host_id, origin, destination, depart_at, total_seats, filled_seats,
     cost_total, ride_type, gender_restriction, has_luggage, memo, status)
  VALUES
    (@host_id, @origin, @destination, @depart_at, @total_seats, @filled_seats,
     @cost_total, @ride_type, @gender_restriction, @has_luggage, @memo, @status)
`);

const rides = [
  {
    host: '김민준', origin: '기숙사', destination: '강남역',
    depart_at: '2026-06-10 08:30', total_seats: 4, filled_seats: 2,
    cost_total: 4500, ride_type: 'carpool', gender_restriction: 'any', has_luggage: 0,
    memo: '조용히 가실 분!', status: 'open',
  },
  {
    host: '이지은', origin: '정문', destination: '수원역',
    depart_at: '2026-06-10 09:00', total_seats: 4, filled_seats: 3,
    cost_total: 7200, ride_type: 'taxi', gender_restriction: 'any', has_luggage: 0,
    memo: '빠르게 가요!', status: 'open',
  },
  {
    host: '박준서', origin: '기숙사', destination: '홍대입구역',
    depart_at: '2026-06-10 10:15', total_seats: 4, filled_seats: 4,
    cost_total: 3800, ride_type: 'carpool', gender_restriction: 'any', has_luggage: 0,
    memo: null, status: 'closed',
  },
  {
    host: '최서연', origin: '정문', destination: '신촌역',
    depart_at: '2026-06-10 11:00', total_seats: 3, filled_seats: 1,
    cost_total: 8500, ride_type: 'taxi', gender_restriction: 'any', has_luggage: 0,
    memo: '같이 가요 :)', status: 'open',
  },
  {
    host: '정우진', origin: '기숙사', destination: '판교역',
    depart_at: '2026-06-10 13:30', total_seats: 4, filled_seats: 2,
    cost_total: 5000, ride_type: 'carpool', gender_restriction: 'any', has_luggage: 1,
    memo: '짐 있어요!', status: 'open',
  },
  {
    host: '강하은', origin: '정문', destination: '강남역',
    depart_at: '2026-06-10 18:00', total_seats: 4, filled_seats: 1,
    cost_total: 9200, ride_type: 'taxi', gender_restriction: 'female', has_luggage: 0,
    memo: '여성분만 탑승 가능합니다.', status: 'open',
  },
];

const insertRides = db.transaction(() =>
  rides.forEach(r => insertRide.run({ ...r, host_id: userMap[r.host] }))
);
insertRides();

// ─── 완료된 라이드 + 리뷰 샘플 ────────────────────────────
const rideIds = db.prepare('SELECT id FROM rides').all().map(r => r.id);

// 두 번째 라이드(이지은 호스트)를 completed로 변경
db.prepare(`UPDATE rides SET status = 'completed' WHERE id = ?`).run(rideIds[1]);

// 리뷰 삽입: reviewer=박준서, reviewee=이지은(호스트)
db.prepare(`
  INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, comment)
  VALUES (?, ?, ?, ?, ?)
`).run(rideIds[1], userMap['박준서'], userMap['이지은'], 5, '정말 친절하셨어요!');

// ─── 완료 출력 ────────────────────────────────────────────
console.log('\n✅ Seed 완료');
console.log('  rides:', db.prepare('SELECT COUNT(*) as cnt FROM rides').get().cnt + '개');
console.log('  users:', db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt + '개');
console.log('  reviews:', db.prepare('SELECT COUNT(*) as cnt FROM reviews').get().cnt + '개');

db.close();