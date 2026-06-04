// server/db/seed.js
// 실행: node server/db/seed.js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const { getDb } = require('./db')

const db = getDb()

// ── 초기화 ──
db.prepare('DELETE FROM reviews').run()
db.prepare('DELETE FROM applications').run()
db.prepare('DELETE FROM rides').run()
db.prepare('DELETE FROM users').run()
for (const t of ['reviews','applications','rides','users'])
  db.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(t)

// ── 유저 삽입 (bcrypt 없이 개발용 평문) ──
// 실제 운영 시 password_hash에 bcrypt 해시값 사용
const insertUser = db.prepare(`
  INSERT INTO users (student_id, password_hash, nickname, gender, manner_score, ride_count)
  VALUES (@student_id, @password_hash, @nickname, @gender, @manner_score, @ride_count)
`)
const users = [
  { student_id:'2021001', password_hash:'$dev$password123', nickname:'이준호', gender:'male',   manner_score:48.0, ride_count:34 },
  { student_id:'2021002', password_hash:'$dev$password123', nickname:'박서연', gender:'female', manner_score:45.0, ride_count:21 },
  { student_id:'2021003', password_hash:'$dev$password123', nickname:'최민준', gender:'male',   manner_score:42.0, ride_count:12 },
  { student_id:'2021004', password_hash:'$dev$password123', nickname:'김지수', gender:'female', manner_score:49.0, ride_count:56 },
  { student_id:'2021005', password_hash:'$dev$password123', nickname:'윤태양', gender:'male',   manner_score:46.0, ride_count:28 },
  { student_id:'2021006', password_hash:'$dev$password123', nickname:'임하은', gender:'female', manner_score:47.0, ride_count:43 },
]
const insertUsers = db.transaction(() => users.forEach(u => insertUser.run(u)))
insertUsers()

// 유저 ID 매핑
const userMap = Object.fromEntries(
  db.prepare('SELECT id, nickname FROM users').all().map(u => [u.nickname, u.id])
)

// ── 라이드 삽입 (프론트 MOCK_RIDES와 동일) ──
const insertRide = db.prepare(`
  INSERT INTO rides
    (host_id, origin, destination, depart_at, total_seats, filled_seats,
     cost_total, ride_type, gender_restriction, has_luggage, memo, status)
  VALUES
    (@host_id, @origin, @destination, @depart_at, @total_seats, @filled_seats,
     @cost_total, @ride_type, @gender_restriction, @has_luggage, @memo, @status)
`)

const rides = [
  {
    host: '이준호', origin:'기숙사', destination:'서울역',
    depart_at:'2026-06-03 08:30', total_seats:4, filled_seats:2,
    cost_total:4500, ride_type:'carpool', gender_restriction:'any', has_luggage:0,
    memo:'안전하게 모셔다 드릴게요!', status:'open'
  },
  {
    host: '박서연', origin:'정문', destination:'강남역',
    depart_at:'2026-06-03 09:00', total_seats:4, filled_seats:3,
    cost_total:7200, ride_type:'taxi', gender_restriction:'any', has_luggage:0,
    memo:'택시 동승 구해요. 빠르게 이동해요!', status:'open'
  },
  {
    host: '최민준', origin:'후문', destination:'수원역',
    depart_at:'2026-06-03 10:15', total_seats:4, filled_seats:4,
    cost_total:3800, ride_type:'carpool', gender_restriction:'any', has_luggage:0,
    memo:null, status:'closed'
  },
  {
    host: '김지수', origin:'기숙사', destination:'강남역',
    depart_at:'2026-06-03 11:00', total_seats:3, filled_seats:1,
    cost_total:8500, ride_type:'taxi', gender_restriction:'any', has_luggage:0,
    memo:'여유롭게 이동해요 :)', status:'open'
  },
  {
    host: '윤태양', origin:'정문', destination:'천안역',
    depart_at:'2026-06-03 13:30', total_seats:4, filled_seats:2,
    cost_total:5000, ride_type:'carpool', gender_restriction:'any', has_luggage:1,
    memo:'짐 있어도 괜찮아요!', status:'open'
  },
  {
    host: '임하은', origin:'후문', destination:'판교역',
    depart_at:'2026-06-03 18:00', total_seats:4, filled_seats:1,
    cost_total:9200, ride_type:'taxi', gender_restriction:'female', has_luggage:0,
    memo:'여성분만 탑승 가능해요.', status:'open'
  },
]

const insertRides = db.transaction(() =>
  rides.forEach(r => insertRide.run({ ...r, host_id: userMap[r.host] }))
)
insertRides()

// ── 완료된 라이드 후기 추가 ──
const rideIds = db.prepare('SELECT id FROM rides').all().map(r => r.id)

db.prepare(`
  UPDATE rides SET status = 'completed' WHERE id = ?
`).run(rideIds[1])  // 정문→강남역 완료 처리

db.prepare(`
  INSERT INTO reviews (ride_id, reviewer_id, score, content)
  VALUES (?, ?, ?, ?)
`).run(rideIds[1], userMap['박서연'], 5, '최고의 동승이었어요! 또 함께 타고 싶어요.')

// ── 최종 확인 ──
console.log('\n✅ 시드 완료!')
console.log('  rides:', db.prepare('SELECT COUNT(*) as cnt FROM rides').get().cnt + '건')
console.log('  users:', db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt + '명')
db.close()
