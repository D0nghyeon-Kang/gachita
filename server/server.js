// server/server.js
require('dotenv').config()
const app       = require('./app')
const { getDb } = require('./db/db')

const PORT = process.env.PORT || 3000

// 서버 시작 시 DB 연결 및 스키마 자동 적용
getDb()

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`)
})
