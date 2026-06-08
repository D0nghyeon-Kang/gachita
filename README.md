# 가치타 (GachiTa)

> 단국대학교 교내 카풀 · 택시 동승 매칭 웹 플랫폼  
> 기숙사생·통학생이 학교 ↔ 주요 거점을 함께 이동할 수 있도록 연결합니다.

---

## 주요 기능

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

## 기술 스택

### 프론트엔드
- **React 18** + **Vite** — 훅 기반 컴포넌트, 빠른 HMR
- **Bootstrap 5** — 반응형 레이아웃 (320px ~ 1440px)
- **Axios** — REST API 통신
- **React Router v6** — 클라이언트 사이드 라우팅

### 백엔드
- **Node.js 20** + **Express 4** — RESTful API 서버
- **better-sqlite3** — SQLite 데이터베이스
- **bcrypt + JWT** — 비밀번호 해시, 인증 토큰

### DevOps
- **ESLint + Prettier** — 코드 스타일 통일
- **GitHub Flow** — feature → develop → main 브랜치 전략

---

## 폴더 구조

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
│       ├── components/    # 재사용 컴포넌트 (Navbar, RideCard, Toast)
│       ├── context/       # AuthContext, ToastContext
│       └── api/           # Axios 인스턴스
├── server/                # Node.js + Express 백엔드
│   ├── routes/            # API 라우터
│   │   ├── auth.js        # 로그인 / 회원가입
│   │   ├── rides.js       # 동승 게시글 CRUD
│   │   ├── applications.js # 참여 신청 / 수락 / 거절
│   │   ├── users.js       # 프로필 조회
│   │   └── reviews.js     # 후기 작성
│   ├── models/            # DB 모델 레이어
│   ├── db/
│   │   ├── schema.sql     # 테이블 DDL + 트리거
│   │   ├── seed.js        # 더미 데이터
│   │   └── db.js          # DB 연결 싱글턴
│   ├── app.js             # Express 앱 설정
│   └── server.js          # 서버 진입점
└── docs/                  # ERD, API 명세
```

---

## 🗄️ 데이터베이스 구조

| 테이블 | 설명 |
|--------|------|
| `users` | 학번 기반 로그인, bcrypt 비밀번호, 별점 평균, 동승 횟수 |
| `rides` | 동승 게시글 (status: open → closed → completed → cancelled) |
| `applications` | 참여 신청 내역 (pending → accepted / rejected) |
| `reviews` | 동승 완료 후 상호 평가 (1~5점) |
| `notifications` | 신청/수락/거절 알림 영속화 |

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
| 20210001 | password123 |
| 20210002 | password123 |

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

## 👥 팀원

| 이름 | 역할 | 담당 |
|------|------|------|
| 최가을 | 백엔드 / PM | Express API 설계, DB 스키마, JWT 인증, 일정 관리 |
| 김민석 | 프론트엔드 | React 컴포넌트 전체, 메인/상세 화면, Bootstrap 반응형, AuthContext |
| 강동현 | 백엔드 / 연동 | 참여 신청 API, 로그인/회원가입 API, 프론트 API 연동 |
| 김다인 | 프론트엔드 / 기획 | 토스트 알림, 입력값 검증, UX 개선, 문서화(README), QA |

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
