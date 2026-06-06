# 같이타 (GachiTa)

> 단국대학교 교내 카풀 · 택시 동승 매칭 웹 플랫폼  
> 기숙사생·통학생이 학교 ↔ 주요 거점을 함께 이동할 수 있도록 연결합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 메인 화면 | 동승 모집 목록 조회, 출발지·날짜 필터 |
| 상세 화면 | 모집글 상세 정보, 참여 신청 및 신청 현황 확인 |
| 글쓰기 | 동승 모집글 작성 (출발지, 목적지, 날짜, 인원 설정) |
| 후기 | 동승 완료 후 상대방에 대한 후기 작성 및 조회 |
| 프로필 | 내 게시글, 신청 내역, 후기, 개인정보 관리 |
| 로그인 / 회원가입 | 학번 기반 인증, JWT 토큰 발급 |

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
- **Socket.io** — 실시간 알림 broadcast

---

## 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/D0nghyeon-Kang/gachita.git
cd gachita

# 2. 의존성 설치
npm install

# 3. 백엔드 실행 (터미널 1)
npm run dev:server

# 4. 프론트엔드 실행 (터미널 2)
npm run dev:client
# → http://localhost:5173
```

---

## 폴더 구조

```
gachita/
├── client/                # React 프론트엔드 (Vite)
│   └── src/
│       ├── pages/         # 라우트 단위 화면 (MainPage, DetailPage, WritePage …)
│       ├── components/    # 재사용 컴포넌트 (Navbar, RideCard …)
│       ├── context/       # Context API 전역 상태
│       ├── hooks/         # 커스텀 훅
│       └── api/           # Axios 인스턴스 및 API 함수
├── server/                # Node.js + Express 백엔드
│   ├── routes/            # API 라우터
│   ├── controllers/       # 비즈니스 로직
│   ├── models/            # DB 쿼리
│   ├── middleware/        # 인증 미들웨어
│   ├── socket/            # 실시간 이벤트
│   └── db/                # SQLite 초기화 스크립트
└── docs/                  # ERD, API 명세, 와이어프레임
```

---

## 팀원 역할

| 이름 | 역할 |
|------|------|
| 김민석 | 프론트엔드 — React 컴포넌트, 메인/상세 화면, Bootstrap 반응형 |
| 최가을 | 백엔드 / PM — Express API 설계, DB 스키마, JWT 인증 |
| 강동현 | 백엔드 — 참여 신청 상태 관리 API, 후기 기능, 알림 처리 |
| 김다인 | DB / 문서화 — 통계 대시보드, 문서화, QA |
