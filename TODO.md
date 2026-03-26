# TODO.md — /quote 견적서 생성기

> 세션 시작 시: "TODO.md부터 읽고 시작해줘"
> 세션 종료 시: "TODO.md 업데이트해줘"

---

## 현재 상태
- [x] 시안 완성 (HTML 단일 파일)
- [x] UX 흐름 확정
- [x] 데이터 구조 확정
- [x] 도메인 확정 (tools.rmeng2.co.kr)
- [x] React 프로젝트 세팅
- [ ] FastComet 서브도메인 생성
- [ ] 구현 시작

---

## Phase 1 — 프로젝트 세팅

- [x] Vite + React 프로젝트 생성
- [x] jsPDF 설치
- [x] 폴더 구조 생성 (CLAUDE.md 5번 참고)
- [ ] GitHub 레포 생성 (rmeng-tools) ← 수동으로 생성 후 연결 필요
- [x] 첫 커밋 "프로젝트 초기 세팅"

---

## Phase 2 — 핵심 상태 관리

- [x] `useQuote.js` hook 작성 (데이터 구조 CLAUDE.md 7번 참고)
- [x] localStorage 연동 (발신자 정보 저장/불러오기)
- [x] 세금 계산 유틸 `taxCalc.js`
- [x] 전화번호/사업자번호 포맷 유틸 `formatters.js`

---

## Phase 3 — 위저드 UI

- [x] `ProgressBar.jsx` — 상단 진행바 + 점 4개
- [x] `Step1.jsx` — 수신자 입력
- [x] `Step2.jsx` — 스타일 선택 3종 카드
- [x] `Step3.jsx` — 품목 테이블 + 세금 유도 질문
- [x] `Step4.jsx` — 발신자 + 메모 프리셋 + 도장
- [x] `Complete.jsx` — 완성 오버레이 + 추가 제안 4개

---

## Phase 4 — 프리뷰 + 문서 렌더링

- [x] `PreviewPanel.jsx` — 우측 실시간 프리뷰
- [x] `DocTemplate.jsx` — 스타일 3종 (A/B/C) 렌더링
- [x] 블러 해제 애니메이션 (Step3 진입 시)
- [ ] 도장 드래그 위치 조정 ← Phase 5와 함께 진행

---

## Phase 5 — 도장 생성

- [ ] `StampCanvas.jsx` — 12종 Canvas 렌더링
- [ ] 색상 4가지 전환
- [ ] 실시간 프리뷰 반영

---

## Phase 6 — PDF 출력

- [ ] `pdfExport.js` — jsPDF 변환 로직
- [ ] 리워드 광고 플로우 연동 (일단 alert → 추후 실제 광고)
- [ ] PDF 파일명: `견적서_수신업체명_날짜.pdf`

---

## Phase 7 — 배포

- [ ] FastComet 서브도메인 생성 (tools.rmeng2.co.kr)
- [ ] `.htaccess` 파일 작성
- [ ] `npm run build` 빌드
- [ ] FTP 업로드
- [ ] 실제 URL 접속 테스트

---

## Phase 8 — 애드센스 연동

- [ ] Google AdSense 신청 (도메인 등록 후)
- [ ] 광고 코드 삽입 (상단 배너, 사이드바)
- [ ] 리워드 광고 → PDF 다운로드 연동

---

## 메모 / 결정 사항

```
2025-03-26  시안 확정 (quote-wizard.html)
            도메인: tools.rmeng2.co.kr
            GitHub: rmeng-tools
            스타일: 모던미니멀(A) / 클래식비즈(B) / 컬러프리미엄(C)
            도장: 12종, 4색상
            세금: 포함/0원/이대로 3가지 유도 방식
            PDF: 리워드 광고 1회 시청 후 무료 다운로드
```
