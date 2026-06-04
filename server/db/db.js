// server/db/db.js
// ─────────────────────────────────────────────────────────────
// DB 연결 파일을 하나로 통일.
// 기존에 db.js(싱글톤 getDb)와 connection.js(즉시 연결)가 둘 다 있어서
// 같은 DB에 연결이 2개 생기는 문제가 있었음.
// 모델들은 connection.js를, 라우터들은 db.js를 따로 쓰고 있었는데
// 이 파일 하나로 통일함.
//
// 사용법:
//   const { getDb } = require('../db/db')   ← 라우터 기존 코드 그대로 동작
//   const db = require('../db/db')          ← 모델 기존 코드도 동작하도록
//                                             module.exports에 db 인스턴스도 포함
// ─────────────────────────────────────────────────────────────

const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DB_PATH     = path.join(__dirname, 'gachita.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let _db = null;

function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  _db.exec(schema);

  console.log('[DB] connected:', DB_PATH);
  return _db;
}

// 모델 파일들이 require('../db/connection') 또는 require('../db/db') 로
// db 인스턴스를 직접 쓰는 경우를 모두 지원하기 위해
// 싱글톤 인스턴스를 default export에도 포함
const db = getDb();

module.exports = db;
module.exports.getDb = getDb;