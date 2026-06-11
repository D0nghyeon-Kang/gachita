// server/server.js
require('dotenv').config()
const app       = require('./app')
const { getDb } = require('./db/db')
const PORT = process.env.PORT || 3000

// 서버 시작 시 DB 연결 및 스키마 자동 적용
const db = getDb()

// 배포 환경에서 DB가 비어있으면 자동 시드 실행
function autoSeed() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get()
    if (userCount.cnt === 0) {
      console.log('🌱 DB가 비어있어 시드 데이터를 자동 삽입합니다...')
      require('./db/seed')
      console.log('✅ 시드 데이터 삽입 완료!')
    } else {
      console.log(`✅ DB 확인 완료 (유저 ${userCount.cnt}명)`)
    }
  } catch (err) {
    console.error('시드 자동 실행 오류:', err.message)
  }
}

autoSeed()

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`)
})
