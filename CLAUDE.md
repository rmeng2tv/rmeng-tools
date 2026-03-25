# CLAUDE.md — rmeng-tools 프로젝트

> Claude Code 세션 시작 시 이 파일을 먼저 읽고 시작할 것.
> 코드 작성 전 반드시 계획을 먼저 보여주고 승인 후 진행.

---

## 1. 나는 이런 사람이야

- 워드프레스, 구글 앱스 스크립트, CRM 웹앱 개발 병행
- 개발 언어 깊은 지식은 없으나 실전 경험 있음
- VSCode + GitHub 막 시작한 단계
- 작업 환경: VSCode, GitHub, FastComet 호스팅

---

## 2. 핵심 원칙 (절대 규칙)

```
"만들어줘" / "짜줘" 라고 해도
바로 코드 주지 말고 반드시 계획 먼저 보여줄 것.
내가 OK 하기 전까지 코드 작성 금지.
```

- 코드보다 구조가 먼저
- 단순한 구조가 복잡한 로직보다 항상 우선
- if문이 계속 늘어나면 코드 고치지 말고 구조 재설계
- 잘못된 방향이면 덧붙이지 말고 Git reset 후 재설계
- 전문 용어는 반드시 괄호 안에 쉬운 표현 병기

---

## 3. 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | rmeng-tools |
| 서비스 주소 | tools.rmeng2.co.kr |
| GitHub 레포 | rmeng-tools |
| 호스팅 | FastComet 공유호스팅 |
| 배포 방식 | React Vite 빌드 → 정적 파일 → FTP 업로드 |

---

## 4. 기술 스택

```
프레임워크:  React (Vite 기반)
PDF 생성:    jsPDF
로컬 저장:   localStorage (로그인 없이 정보 저장)
스타일링:    CSS (외부 파일 분리)
아이콘:      SVG 파일 (텍스트 이모지 절대 금지)
배포:        정적 파일 빌드 후 FastComet FTP 업로드
```

---

## 5. 폴더 구조

```
rmeng-tools/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Home.jsx          ← 도구 목록 메인페이지
│   │   └── quote/
│   │       ├── index.jsx     ← 견적서 위저드 메인
│   │       ├── Step1.jsx     ← 수신자 입력
│   │       ├── Step2.jsx     ← 스타일 선택
│   │       ├── Step3.jsx     ← 품목 입력 + 세금
│   │       ├── Step4.jsx     ← 발신자 + 메모 + 도장
│   │       └── Complete.jsx  ← 완성 오버레이
│   ├── components/
│   │   ├── ProgressBar.jsx
│   │   ├── PreviewPanel.jsx  ← 실시간 우측 프리뷰
│   │   ├── StampCanvas.jsx   ← 도장 생성 (Canvas)
│   │   └── DocTemplate.jsx   ← 견적서 문서 렌더링
│   ├── hooks/
│   │   └── useQuote.js       ← 견적서 전체 상태 관리
│   ├── utils/
│   │   ├── formatters.js     ← 전화번호, 사업자번호 포맷
│   │   ├── taxCalc.js        ← 세금 계산 로직
│   │   └── pdfExport.js      ← jsPDF 변환
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── icons/            ← SVG 아이콘
│   └── docs/
│       └── README.md         ← 한국어 설명 문서
├── CLAUDE.md                 ← 이 파일
├── TODO.md                   ← 작업 체크리스트
├── DESIGN.md                 ← UI/UX 설계 상세
└── .htaccess                 ← React 라우팅 처리 (FastComet 필수)
```

---

## 6. 코드 작성 규칙

### 절대 금지
- HTML 인라인 `<style>` / `<script>` 태그
- 텍스트 이모지 (😊 🔥 등) — SVG/PNG 사용
- DB 접속 정보 외부 노출
- 망가진 코드 위에 덧붙이기

### 파일 분리 원칙
```
CSS  → /assets/css/style.css
JS   → 컴포넌트별 분리
문서 → /docs/README.md (한국어)
```

### 네이밍 규칙
```
CSS 클래스:  .qt-btn, .qt-table (qt = quote tool 접두사)
JS 함수명:   동사명사() → getItems(), calcTax()
파일명:      PascalCase.jsx (컴포넌트), camelCase.js (유틸)
```

### 보안
- 민감 정보는 .env 파일에만
- SQL 사용 시 prepared statement 필수

---

## 7. 데이터 구조

### 견적서 전체 상태 (useQuote hook)
```javascript
{
  // Step 1
  receiver: {
    name: '',       // 수신 업체명
    person: ''      // 담당자명
  },

  // Step 2
  docStyle: 'a',   // 'a' | 'b' | 'c'

  // Step 3
  items: [
    { id, name, price, qty }
  ],
  taxMode: 'normal', // 'normal' | 'include' | 'zero'

  // Step 4
  sender: {
    name: '',       // 회사명
    ceo: '',        // 대표자
    bizNum: '',     // 사업자번호 (자동포맷)
    tel: ''         // 연락처 010- 자동포맷
  },
  memoItems: [
    { id, text, on }  // 자주쓰는 문구
  ],
  stamp: {
    on: false,
    style: 0,       // 0~11 (12종)
    color: '#dc2626',
    posX: null,     // 드래그 위치
    posY: null
  },

  // 완성 후 추가 제안
  extras: {
    bank: { on: false, value: '' },
    expiry: { on: false, value: '' },
    contact: { on: false, value: '' },
    payment: { on: false, value: '' }
  }
}
```

### localStorage 저장 키
```javascript
'qt_sender'     // 발신자 정보 (재사용)
'qt_memos'      // 자주쓰는 문구 목록
'qt_stamp'      // 도장 설정
```

---

## 8. UX 흐름 (위저드 방식)

```
Step 1 수신자 입력
  → 우측 프리뷰: 수신자명 등장

Step 2 스타일 선택 (3종)
  → 우측 프리뷰: 문서 레이아웃 전환

Step 3 품목 입력 + 세금 선택
  → 우측 프리뷰: 블러 해제 + 품목 실시간 반영
  → 세금: 자연스러운 유도 질문 (포함/0원/이대로)

Step 4 발신자 정보 + 메모 + 도장
  → 연락처: 010- 고정, 숫자 8개 → 자동 하이픈
  → 사업자번호: 자동 하이픈
  → 메모: 박스 클릭 체크, 텍스트 직접 수정, 순서 조정, 직접 입력 추가
  → 도장: 12종 선택, 4색상, 드래그 위치 조정

완성 후 오버레이
  → 추가 제안 4개 (계좌/유효기간/연락처/결제조건)
  → 체크 시 견적서 하단 별도 섹션에 자동 추가
  → PDF 저장 버튼 → 광고 1회 시청 → 다운로드
```

---

## 9. 수익 모델

```
무료 기능:  견적서 작성, 실시간 프리뷰
유료 기능:  PDF 다운로드 (리워드 광고 1회 시청 후 해제)
배경 광고:  Google AdSense 배너 (상단/사이드바)
```

---

## 10. 도장 스타일 12종

| # | 이름 | 형태 |
|---|------|------|
| 0 | 원형 단선 | 원 + 회사명/대표자 |
| 1 | 원형 이중선 | 이중 원 |
| 2 | 원형 내부선 | 원 + 가로선 |
| 3 | 원형 별장식 | 원 + ★ |
| 4 | 원형 도트테두리 | 점선 원 |
| 5 | 사각 직인 | 사각형 |
| 6 | 사각 이중선 | 이중 사각 |
| 7 | 둥근 사각형 | 라운드 사각 |
| 8 | 타원형 | 타원 |
| 9 | 낙관형 | 이름 크게 |
| 10 | 다이아형 | 마름모 |
| 11 | 팔각형 | 팔각 |

색상: 빨강(#dc2626) / 파랑(#1d4ed8) / 검정(#1e293b) / 보라(#7c3aed)

---

## 11. 배포 방법 (FastComet)

```bash
# 1. 빌드
npm run build

# 2. /dist 폴더 내용을 FTP로 업로드
#    업로드 경로: public_html/tools/ (서브도메인 루트)

# 3. .htaccess 파일 필수 (React 라우팅)
```

**.htaccess 내용**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

---

## 12. Git 커밋 규칙

```
한국어로 간단하게
예) "견적서 Step3 세금 계산 기능 추가"
    "도장 12종 Canvas 구현"
    "FastComet 배포 설정 완료"

기능 단위로 커밋 (한 번에 너무 많이 올리지 않기)
잘못된 방향이면 git reset 후 재설계
절대 망가진 코드 위에 덧붙이지 않기
```

---

## 13. 에러 발생 시

1. 에러 로그 전체를 그대로 붙여넣기
2. 원인 먼저 설명 (바로 고치지 말 것)
3. 잘못된 가정 발견 시 즉시 중단 후 방향 수정
4. 덧붙이지 말고 원인부터 파악 후 재작성

---

## 14. 참고 자료 (시안)

- `reference/quote-wizard.html` — 확정된 UI 시안 (단일 HTML 파일)
  - 이 파일을 기준으로 컴포넌트 구현할 것
  - Step1~4 위저드 흐름, 실시간 프리뷰, 도장 12종, 세금 유도 질문 전부 포함
  - 스타일 / UX 흐름 / 데이터 구조 모두 이 파일에서 확인 가능
  - React 컴포넌트로 분리할 때 이 파일의 HTML/CSS/JS를 기준으로 삼을 것

---

## 15. 향후 추가 예정 도구

```
/employment   재직증명서
/salary       연봉 실수령액 계산기
/retirement   퇴직금 계산기
/spell        맞춤법 검사기
/wordcount    글자수 세기
/tax          부가세 계산기
/invoice      청구서 생성기
```
