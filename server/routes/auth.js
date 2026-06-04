// server/routes/auth.js
const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcrypt')
const jwt     = require('jsonwebtoken')
const { getDb } = require('../db/db')

const JWT_SECRET   = process.env.JWT_SECRET || 'gachita-dev-secret'
const SALT_ROUNDS  = 10

// ── POST /api/auth/register 또는 /signup (회원가입)
router.post(['/register', '/signup'], async (req, res) => {
  try {
    const db = getDb()
    const { student_id, password, nickname, gender } = req.body

    // 필수값 검증
    if (!student_id || !password || !nickname) {
      return res.status(400).json({ error: '학번, 비밀번호, 닉네임은 필수예요.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 6자 이상이어야 해요.' })
    }

    // 중복 체크
    const existId = db.prepare('SELECT id FROM users WHERE student_id = ?').get(student_id)
    if (existId) return res.status(409).json({ error: '이미 가입된 학번이에요.' })

    const existNick = db.prepare('SELECT id FROM users WHERE nickname = ?').get(nickname)
    if (existNick) return res.status(409).json({ error: '이미 사용 중인 닉네임이에요.' })

    // 비밀번호 해시
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS)

    // 유저 생성
    const result = db.prepare(`
      INSERT INTO users (student_id, password_hash, nickname, gender)
      VALUES (?, ?, ?, ?)
    `).run(student_id, password_hash, nickname, gender || 'other')

    const user = db.prepare(
      'SELECT id, student_id, nickname, gender, manner_score, ride_count FROM users WHERE id = ?'
    ).get(result.lastInsertRowid)

    // JWT 발급
    const token = jwt.sign({ id: user.id, nickname: user.nickname }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── POST /api/auth/login  (로그인)
router.post('/login', async (req, res) => {
  try {
    const db = getDb()
    const { student_id, password } = req.body

    if (!student_id || !password) {
      return res.status(400).json({ error: '학번과 비밀번호를 입력해주세요.' })
    }

    // 유저 조회
    const user = db.prepare('SELECT * FROM users WHERE student_id = ?').get(student_id)
    if (!user) return res.status(401).json({ error: '학번 또는 비밀번호가 틀렸어요.' })

    // 비밀번호 확인
    // 시드 데이터의 경우 개발용 평문 비밀번호 처리
    let isValid = false
    if (user.password_hash.startsWith('$dev$')) {
      isValid = password === user.password_hash.replace('$dev$', '')
    } else {
      isValid = await bcrypt.compare(password, user.password_hash)
    }

    if (!isValid) return res.status(401).json({ error: '학번 또는 비밀번호가 틀렸어요.' })

    // JWT 발급
    const token = jwt.sign({ id: user.id, nickname: user.nickname }, JWT_SECRET, { expiresIn: '7d' })

    const userInfo = {
      id: user.id,
      student_id: user.student_id,
      nickname: user.nickname,
      gender: user.gender,
      manner_score: user.manner_score,
      ride_count: user.ride_count,
    }

    res.json({ token, user: userInfo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했어요.' })
  }
})

// ── GET /api/auth/me  (내 정보 확인)
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: '로그인이 필요해요.' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const db = getDb()
    const user = db.prepare(
      'SELECT id, student_id, nickname, gender, manner_score, ride_count FROM users WHERE id = ?'
    ).get(decoded.id)

    if (!user) return res.status(404).json({ error: '유저를 찾을 수 없어요.' })
    res.json(user)
  } catch (err) {
    res.status(401).json({ error: '유효하지 않은 토큰이에요.' })
  }
})

module.exports = router
