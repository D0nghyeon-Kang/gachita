// server/db/db.js
const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_PATH    = path.join(__dirname, 'gachita.db')
const SCHEMA_PATH = path.join(__dirname, 'schema.sql')

let _db = null

function getDb() {
  if (_db) return _db

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  _db.exec(schema)

  console.log('[DB] 연결 완료 →', DB_PATH)
  return _db
}

module.exports = { getDb }
