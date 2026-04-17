# 기여 가이드라인 (Contributing Guide)

같이타(GachiTa) 프로젝트에 기여해 주셔서 감사합니다! 아래 가이드라인을 참고해 주세요.

---

## 브랜치 전략

```
main       ← 배포용 (직접 push 금지)
develop    ← 통합 브랜치
feature/이슈번호-기능명  ← 기능 개발
```

## 커밋 메시지 규칙 (Conventional Commits)

```
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 수정
style:    코드 포맷 변경 (기능 변경 없음)
refactor: 코드 리팩토링
test:     테스트 추가/수정
chore:    빌드, 패키지 설정 변경
```

예시: `feat: 동승 게시글 목록 조회 API 구현`

## PR 절차

1. `develop` 브랜치에서 `feature/이슈번호-기능명` 브랜치 생성
2. 기능 개발 후 커밋
3. Pull Request 생성 → 최소 1인 리뷰 후 머지
4. PR 템플릿의 체크리스트 항목 확인 후 제출

## 코드 스타일

- ESLint + Prettier 규칙을 따릅니다.
- 커밋 전 `npm run lint` 실행을 권장합니다.
