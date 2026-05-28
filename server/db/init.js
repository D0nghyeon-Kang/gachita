// server/db/init.js
// 실행: node db/init.js

const Database = require('better-sqlite3');
const fs       = require('fs');
const path     = require('path');

const DB_PATH     = path.join(__dirname, 'gachita.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

function initDB() {
  const forceReset = process.argv.includes('--force');

  if (forceReset && fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('기존 DB 파일 삭제 완료');
  }

  const db     = new Database(DB_PATH);
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(schema);

  console.log(`✅ DB 초기화 완료: ${DB_PATH}`);
  db.close();
}

initDB();