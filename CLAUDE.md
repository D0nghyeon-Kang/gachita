# CLAUDE.md — 같이타 (GachiTa) 프로젝트 가이드

## 프로젝트 개요

**같이타(GachiTa)** — 교내 카풀 및 택시 동승 매칭 웹 플랫폼.  
대학교 기숙사생·통학생이 학교 ↔ 주요 거점 사이를 함께 이동할 수 있도록 연결한다.

## 담당자 정보

| 이름 | 역할 | 담당 영역 |
|------|------|-----------|
| 최가을 | 백엔드 / PM | Express API 설계, DB 스키마, JWT 인증 |
| **김민석** | **프론트엔드** | **React 컴포넌트, 메인/상세 화면, Bootstrap 반응형** |
| 강동현 | 백엔드 | 참여 신청 상태 관리 API, 후기 기능, 알림 처리 |
| 김다인 | 프론트엔드 / 기획 | 통계 대시보드, 문서화, QA |

> 이 세션의 사용자: **김민석 (프론트엔드 담당)**

## 기술 스택

### 프론트엔드 (`/client`)
- **React 18** + **Vite** — 훅 기반 컴포넌트, 빠른 HMR
- **Bootstrap 5** — 반응형 레이아웃 (320px ~ 1440px)
- **Axios** — REST API 통신
- **Context API + useReducer** — 경량 전역 상태 관리
- **Socket.io-client** — 실시간 알림 수신

### 백엔드 (`/server`)
- **Node.js 20** + **Express 4** — RESTful API
- **better-sqlite3** — SQLite DB
- **bcrypt + JWT** — 인증 및 보안
- **Socket.io** — 실시간 알림 broadcast

## 폴더 구조

```
gachita/
├── client/                # React 프론트엔드 (Vite)
│   └── src/
│       ├── pages/         # 라우트 단위 화면
│       ├── components/    # 재사용 컴포넌트
│       ├── context/       # Context API 전역 상태
│       ├── hooks/         # 커스텀 훅
│       └── api/           # Axios 인스턴스 및 API 함수
├── server/                # Node.js + Express 백엔드
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── socket/
│   └── db/
├── docs/                  # ERD, API 명세, 와이어프레임
├── .github/               # PR·Issue 템플릿, Actions
├── CLAUDE.md              # (이 파일)
├── CONTRIBUTING.md
└── README.md
```

## 브랜치 전략

```
main        — 배포용 (직접 커밋 금지)
develop     — 통합 브랜치
feature/*   — 기능 개발 (작업은 반드시 여기서)
```

브랜치 네이밍: `feature/이슈번호-기능명`  
예: `feature/12-ride-card-component`

## 커밋 규칙 (Conventional Commits)

| 타입 | 용도 |
|------|------|
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `style:` | 스타일/레이아웃 변경 (기능 변경 없음) |
| `docs:` | 문서 수정 |
| `chore:` | 빌드 설정, 의존성 변경 등 |
| `refactor:` | 리팩터링 |
| `test:` | 테스트 추가/수정 |

**모든 커밋 메시지는 한국어로 작성.**  
예: `feat: 동승 목록 카드 컴포넌트 추가`

## 주요 작업 규칙

- 모든 답변과 커밋 메시지는 **한국어**로 작성
- 작업은 항상 `feature` 브랜치에서 시작
- PR은 `develop` 브랜치로 요청
- 컴포넌트 파일명: PascalCase (`RideCard.jsx`)
- 훅 파일명: camelCase + use 접두사 (`useRideList.js`)
- API 함수는 `/client/src/api/` 아래에 모아서 관리

## 로컬 실행

```bash
# 의존성 설치
npm install

# 백엔드 실행 (터미널 1)
npm run dev:server

# 프론트엔드 실행 (터미널 2)
npm run dev:client
# → http://localhost:5173
```
