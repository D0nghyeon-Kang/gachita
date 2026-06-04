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
| 🔐 **회원가입 / 로그인** | 학번 기반 회원가입, JWT 토큰 인증 |
| 🗺️ **동승 모집 목록** | 현재 모집 중인 게시글을 카드 형식으로 확인, 카풀/택시 필터 |
| ✍️ **게시글 작성** | 출발지·목적지·시간·인원·비용·성별 조건·수하물 유무 입력 |
| 🔍 **검색 및 필터** | 키워드 검색(debounce), 시간대·잔여 좌석·비용 정렬 필터 |
| 📩 **참여 신청 / 수락** | 신청(pending) → 모집자 수락 → 잔여 좌석 자동 갱신 |
| 👤 **프로필 / 신청자 관리** | 내가 올린 게시글의 신청자 목록 확인 및 수락/거절 처리 |
| ⭐ **후기 별점** | 동승 완료 후 평가, 별점으로 신뢰도 표시 |

---

## 🛠️ 기술 스택

### Frontend
- **React 18** + **Vite** — 빠른 HMR, 훅 기반 컴포넌트
- **Bootstrap 5** — 반응형 레이아웃 (320px ~ 1440px)
- **Axios** — REST API 통신
- **React Router v6** — 클라이언트 사이드 라우팅

### Backend
- **Node.js 20** + **Express 4** — RESTful API 서버
- **better-sqlite3** — SQLite DB (파일 기반, 배포 간편)
- **bcrypt** — 비밀번호 해시 암호화
- **jsonwebtoken (JWT)** — 로그인 인증 토큰 발급

### DevOps
- **ESLint + Prettier** — 코드 스타일 통일
- **GitHub Flow** — feature → develop → main 브랜치 전략

---

## 📁 프로젝트 구조

```
gachita/
├── client/                # React 프론트엔드 (Vite)
│   └── src/
│       ├── pages/         # 화면 단위 컴포넌트
│       │   ├── MainPage.jsx
│       │   ├── DetailPage.jsx
│       │   ├── WritePage.jsx
│       │   ├── ReviewPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       ├── components/    # 재사용 컴포넌트 (Navbar, RideCard)
│       └── api/           # Axios 인스턴스
├── server/                # Node.js + Express 백엔드
│   ├── routes/            # API 라우터
│   │   ├── auth.js        # 로그인 / 회원가입
│   │   ├── rides.js       # 동승 게시글 CRUD
│   │   ├── applications.js # 참여 신청 / 수락 / 거절
│   │   ├── users.js       # 프로필 조회
│   │   └── reviews.js     # 후기 작성
│   ├── db/
│   │   ├── schema.sql     # 테이블 DDL + 트리거
│   │   ├── seed.js        # 더미 데이터
│   │   └── db.js          # DB 연결 싱글턴
│   ├── app.js             # Express 앱 설정
│   └── server.js          # 서버 진입점
├── docs/                  # ERD, API 명세
├── README.md
└── CONTRIBUTING.md
```

---

## 🗄️ 데이터베이스 구조

| 테이블 | 설명 |
|--------|------|
| `users` | 학번 기반 로그인, bcrypt 비밀번호, 별점 평균, 동승 횟수 |
| `rides` | 동승 게시글 (status: open → closed → completed → cancelled) |
| `applications` | 참여 신청 내역 (pending → accepted / rejected) |
| `reviews` | 동승 완료 후 상호 평가 (1~5점) |

---

## 🚀 로컬 실행 방법

### 사전 요구사항
- Node.js 20.x 이상
- npm 10.x 이상

### 1. 레포지토리 클론 및 브랜치 이동
```bash
git clone https://github.com/D0nghyeon-Kang/gachita.git
cd gachita
git checkout develop
```

### 2. 백엔드 서버 실행 (터미널 1)
```bash
cd server
cp .env.example .env
npm install
node db/seed.js   # 처음 한 번만 실행
npm run dev
```
→ `http://localhost:3000` 에서 API 서버 실행

### 3. 프론트엔드 실행 (터미널 2)
```bash
cd client
npm install
npm run dev
```
→ `http://localhost:5173` 에서 앱 접속

### 🧪 테스트 계정
| 학번 | 비밀번호 |
|------|----------|
| 2021001 | password123 |
| 2021002 | password123 |

---

## 🔗 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) |
| GET | `/api/rides` | 동승 목록 조회 |
| GET | `/api/rides/:id` | 동승 상세 조회 |
| POST | `/api/rides` | 동승 게시글 등록 |
| POST | `/api/applications` | 참여 신청 (pending) |
| PATCH | `/api/applications/:id` | 신청 수락 / 거절 |
| GET | `/api/users/me` | 내 프로필 조회 |
| POST | `/api/reviews` | 후기 작성 |

---

## 📅 개발 로드맵

| 단계 | 목표 | 상태 |
|------|------|------|
| **v0.1** | 프론트엔드 화면 구성 (메인, 상세, 글쓰기, 후기, 프로필) | ✅ 완료 |
| **v0.2** | 백엔드 API 구현 + 프론트 연동 + 로그인/회원가입 | ✅ 완료 |
| **v1.0** | 실시간 알림 + 배포 | 🔜 예정 |

---

## 👥 팀원

| 이름 | 역할 | 담당 |
|------|------|------|
| 최가을 | 백엔드 / PM | Express API 설계, DB 스키마, JWT 인증, 일정 관리 |
| 김민석 | 프론트엔드 | React 컴포넌트, 메인/상세 화면, Bootstrap 반응형 |
| 강동현 | 백엔드 / 기능 | 참여 신청 API, 로그인 API, 프론트 API 연동 |
| 김다인 | 프론트엔드 / 기획 | 후기/프로필 화면, 문서화(README, CONTRIBUTING), QA |

---

## 🤝 기여하기

1. 이 레포지토리를 **Fork** 합니다.
2. 기능 브랜치를 만듭니다. (`git checkout -b feature/이슈번호-기능명`)
3. 변경 사항을 커밋합니다. (`git commit -m 'feat: 기능 설명'`)
4. 브랜치에 Push합니다. (`git push origin feature/이슈번호-기능명`)
5. **Pull Request**를 보냅니다.

> 브랜치 전략: `main` (배포) / `develop` (통합) / `feature/이슈번호-설명`

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 배포됩니다.

---

<div align="center">
  <sub>오픈소스 SW기초 팀 프로젝트 | 강동현 · 김다인 · 김민석 · 최가을</sub>
</div>
