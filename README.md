# 🚕 같이타 (GachiTa)

> 교내 카풀 및 택시 동승 매칭 플랫폼

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org/)

---

## 📖 프로젝트 소개

**같이타**는 대학교 기숙사생 및 통학생들이 학교와 주요 거점(지하철역, 터미널, 번화가) 사이를 이동할 때  
택시 또는 카풀을 함께 이용할 수 있도록 연결해 주는 **실시간 동승 매칭 웹 플랫폼**입니다.

에브리타임·단체 카카오톡 채팅방에 흩어져 있던 동승 모집 글을 하나의 플랫폼으로 통합하고,  
출발지·목적지·시간대 기반 검색, 실시간 좌석 현황, 후기 별점 기반 신뢰 시스템을 제공합니다.

> 💬 *"배차 간격 걱정 없이, 교통비는 아끼고, 안전하게 이동한다."*

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🗺️ **동승 모집 목록** | 현재 모집 중인 게시글을 카드 형식으로 확인, 인기 게시글 배지 표시 |
| ✍️ **게시글 작성** | 출발지·목적지·시간·인원·비용·성별 조건·수하물 유무 입력 |
| 🔍 **검색 및 필터** | 키워드 검색(debounce), 시간대·잔여 좌석·비용 정렬 필터 |
| 📩 **참여 신청** | 신청 → 실시간 알림 → 수락/거절 → 좌석 수 자동 갱신 |
| ⭐ **후기 별점** | 동승 완료 후 상호 평가, 별점 평균으로 신뢰도 표시 |
| 📊 **통계 대시보드** | 요일별·시간대별 인기 경로 순위, 동승 완료 이력 |

---

## 🛠️ 기술 스택

### Frontend
- **React 18** + **Vite** — 빠른 HMR, 훅 기반 컴포넌트
- **Context API + useReducer** — 경량 전역 상태 관리
- **Bootstrap 5** — 반응형 레이아웃 (320px ~ 1440px)
- **Axios** — REST API 통신
- **Socket.io-client** — 실시간 알림 수신

### Backend
- **Node.js 20** + **Express 4** — RESTful API 서버
- **Socket.io** — 실시간 좌석 갱신·신청 알림 broadcast
- **better-sqlite3** — SQLite DB (파일 기반, 배포 간편)
- **bcrypt + JWT** — 인증 및 보안
- **express-validator** — 입력 검증

### DevOps
- **GitHub Actions** — PR 시 Lint·테스트 자동화 (여건에 따라 적용)
- **ESLint + Prettier** — 코드 스타일 통일
- **Vercel** (프론트) / **Railway or Render** (백엔드) — 배포

---

## 📁 프로젝트 구조

```
gachita/
├── client/                # React 프론트엔드 (Vite)
│   └── src/
│       ├── pages/         # 라우트 단위 화면
│       ├── components/    # 재사용 컴포넌트
│       ├── context/       # Context API (전역 상태)
│       ├── hooks/         # 커스텀 훅
│       └── api/           # Axios 인스턴스 및 API 함수
├── server/                # Node.js + Express 백엔드
│   ├── routes/            # Express 라우터
│   ├── controllers/       # 비즈니스 로직
│   ├── models/            # DB 모델
│   ├── middleware/        # JWT 인증, 입력 검증
│   ├── socket/            # Socket.io 이벤트
│   └── db/
│       ├── schema.sql     # 테이블 DDL
│       ├── seed.js        # 더미 데이터
│       └── db.js          # DB 연결 싱글턴
├── docs/                  # ERD, API 명세, 와이어프레임
├── .github/               # PR·Issue 템플릿, Actions
├── README.md
└── CONTRIBUTING.md
```

---

## 🗄️ 데이터베이스 구조

| 테이블 | 설명 |
|--------|------|
| `users` | 학번 기반 로그인, 별점 평균, 동승 횟수 |
| `rides` | 동승 게시글 (status: open → confirmed → completed → cancelled) |
| `applications` | 참여 신청 내역 (중복 신청 방지 복합 유니크) |
| `reviews` | 동승 완료 후 상호 평가 (1~5점) |
| `manner_score_log` | 별점 변동 이력 자동 기록 |
| `notifications` | 신청/수락/거절/확정 알림 영속화 |

---

## 🚀 로컬 실행 방법

### 사전 요구사항
- Node.js 20.x 이상
- npm 10.x 이상

### 1. 레포지토리 클론
```bash
git clone https://github.com/D0nghyeon-Kang/gachita.git
cd gachita
```

### 2. 의존성 설치
```bash
# 루트에서 client + server 의존성 한 번에 설치 (npm workspaces)
npm install
```

### 3. 환경 변수 설정
```bash
cp server/.env.example server/.env
# server/.env 파일을 열어 JWT_SECRET 등 값 입력
```

### 4. DB 초기화 및 더미 데이터 삽입
```bash
node server/db/seed.js
```

### 5. 개발 서버 실행
```bash
# 터미널 1 — 백엔드
npm run dev:server

# 터미널 2 — 프론트엔드
npm run dev:client
```

브라우저에서 `http://localhost:5173` 접속

---

## 📅 개발 로드맵

| 단계 | 기간 | 목표 |
|------|------|------|
| **v0.1** | 1~2주차 | 게시글 CRUD + 목록 조회 |
| **v0.2** | 3~4주차 | 참여 신청 + 상태 관리 |
| **v0.3** | 5~6주차 | 후기(별점) 시스템 |
| **v0.4** | 7~8주차 | 추천·통계 기능 |
| **v1.0** | 9~10주차 | 실시간 알림 + 초도 배포 |

---

## 👥 팀원

| 이름 | 역할 | 담당 |
|------|------|------|
| 최가을 | 백엔드 / PM | Express API 설계, DB 스키마, JWT 인증, 일정 관리 |
| 김민석 | 프론트엔드 | React 컴포넌트, 메인/상세 화면, Bootstrap 반응형 |
| 강동현 | 백엔드 / 기능 | 참여 신청 상태 관리 API, 후기 기능, 알림 처리 |
| 김다인 | 프론트엔드 / 기획 | 통계 대시보드, 문서화(README, CONTRIBUTING), QA |

---

## 🤝 기여하기

기여를 환영합니다! 아래 순서로 참여해 주세요.

1. 이 레포지토리를 **Fork** 합니다.
2. 기능 브랜치를 만듭니다. (`git checkout -b feature/이슈번호-기능명`)
3. 변경 사항을 커밋합니다. (`git commit -m 'feat: 기능 설명'`)
4. 브랜치에 Push합니다. (`git push origin feature/이슈번호-기능명`)
5. **Pull Request**를 보냅니다.

자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 확인해 주세요.

> 브랜치 전략: `main` (배포) / `develop` (통합) / `feature/이슈번호-설명`

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 배포됩니다.

---

<div align="center">
  <sub>오픈소스 SW기초 팀 프로젝트 | 강동현 · 김다인 · 김민석 · 최가을</sub>
</div>
