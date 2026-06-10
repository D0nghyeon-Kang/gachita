// server/app.js
const express = require('express');
const cors    = require('cors');
const app     = express();

// CORS 설정 - 배포 환경 포함
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gachita-client.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());

// 라우터 등록
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/rides',        require('./routes/rides'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/reviews',      require('./routes/reviews'));

// 헬스 체크
app.get('/', (req, res) => res.json({ message: 'GachiTa API 서버' }));

// 404 처리
app.use((req, res) => res.status(404).json({ error: '존재하지 않는 API입니다.' }));

module.exports = app;
