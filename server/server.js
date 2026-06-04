// server/server.js
require('dotenv').config()
const app = require('./app')
const { getDb } = require('./db/db')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

// DB 초기화 (schema.sql 자동 실행)
getDb()

app.listen(PORT, () => {
  console.log(`✅ 같이타 서버 실행 중 → http://localhost:${PORT}`)
})
