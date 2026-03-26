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
- [x] FastComet 서브도메인 + 배포
- [x] GitHub 자동 배포 (push → 빌드 → FTP)
- [ ] 모바일 테스트 및 최적화 (진행 중)

---

## Phase 1~4 — 완료

- [x] Vite + React + jsPDF 프로젝트 세팅
- [x] useQuote.js 상태 관리 + localStorage 연동
- [x] taxCalc.js, formatters.js 유틸
- [x] Step1~4 위저드 UI + ProgressBar
- [x] Complete 오버레이 (추가 정보 3개 + 견적 작성일 변경)
- [x] PreviewPanel + DocTemplate 스타일 4종 (A/B/C/D)
- [x] 블러 해제 + 페이지 분리 표시

---

## Phase 5 — 도장 (보류)

- 고객 반응 확인 후 추가 예정
- 코드: StampSection.jsx, StampCanvas.jsx 보존 중

---

## Phase 6 — PDF + 이미지 출력 (완료)

- [x] PDF: 브라우저 인쇄 방식 (window.print + @media print CSS)
- [x] 이미지: html2canvas scale 3
- [x] 파일명 통일: 견적서_업체명_날짜

---

## Phase 7 — 배포 (완료)

- [x] FastComet 서브도메인 생성 (tools.rmeng2.co.kr)
- [x] .htaccess (HTTPS 강제, 보안 헤더, 캐싱)
- [x] GitHub Actions 자동 배포 (push → build → FTP)
- [x] SEO 메타태그 + Open Graph
- [x] Pretendard 폰트 로컬 호스팅

---

## 남은 작업 / 개선 필요

### 모바일
- [ ] 모바일 크롬 입력 필드 테스트 (키보드 올라올 때 튕김 수정 배포함 — 확인 필요)
- [ ] 카카오톡 인앱 브라우저 대응 (외부 브라우저 리다이렉트 배포함 — 확인 필요)
- [ ] 모바일 전체 UX 점검 (Step1~4 + 완성 화면)

### PDF/이미지 품질
- [ ] PDF 인쇄 시 폰트 사이즈/여백 실기기 확인 후 미세 조정
- [ ] 이미지 다운로드 품질 실기기 확인
- [ ] 2페이지 이상일 때 PDF 페이지 나눔 정리

### UI 개선
- [ ] 프리뷰 문서 폰트 사이즈 추가 축소 검토
- [ ] A4 넘침 시 프리뷰 페이지 분리 UX 개선
- [ ] 스타일 C (컬러 프리미엄) 디자인 추가 개선 검토

### 향후
- [ ] Google Search Console / 네이버 웹마스터 등록
- [ ] Phase 8: 애드센스 연동
- [ ] 가망 고객 DB 수집 (이메일/전화번호) — 회원가입 기능과 함께
- [ ] 추가 도구 개발 (재직증명서, 연봉 계산기 등)

---

## 메모 / 결정 사항

```
2026-03-26  Phase 1~7 완료, 실서버 배포
            도메인: tools.rmeng2.co.kr
            GitHub: rmeng2tv/rmeng-tools (자동 배포)
            스타일: 모던미니멀(A) / 클래식비즈(B) / 컬러프리미엄(C) / 웜내추럴(D)
            도장: 보류 (고객 반응 확인 후)
            세금: 포함/0원/이대로 3가지 유도 방식
            PDF: 브라우저 인쇄 방식 (텍스트 선택 가능, 화질 최상)
            이미지: html2canvas scale 3
            이메일 전송: 1차 출시 제외
            결제조건: 추가정보에서 제외
```
