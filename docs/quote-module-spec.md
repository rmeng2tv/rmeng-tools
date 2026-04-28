# 견적서 모듈 스펙 — CRM 이식용

> 이 문서는 rmeng-tools의 견적서 위저드를 CRM에 탑재할 때 참고용입니다.
> CRM 프로젝트에서 Claude에게 이 파일을 먼저 읽히면 빠르게 이해할 수 있습니다.

---

## 1. 모듈 개요

| 항목 | 내용 |
|------|------|
| 기능 | 견적서 작성 위저드 (4단계) + 실시간 프리뷰 + PDF/이미지 다운로드 |
| 원본 | tools.rmeng2.co.kr (React Vite, FastComet 호스팅) |
| 이식 대상 | 거래처 CRM (React Vite, 카페24 호스팅) |
| 의존 라이브러리 | `jspdf`, `html2canvas` |
| 저장 방식 | localStorage (서버 DB 없음) |

---

## 2. 위저드 흐름

```
Step 1  수신자 입력 (업체명, 담당자)
  ↓
Step 2  문서 스타일 선택 (A 모던 / B 클래식 / C 컬러 / D 내추럴)
  ↓
Step 3  품목 입력 + 세금 모드 선택 (별도 10% / 포함 / 면세)
  ↓
Step 4  발신자 정보 + 자주 쓰는 문구 + (도장 — 추후 추가)
  ↓
Complete  추가 제안 (계좌/유효기간/연락처/결제조건) → PDF/이미지 저장
```

---

## 3. 데이터 구조 (핵심)

견적서 전체 상태를 하나의 객체로 관리합니다.

```javascript
{
  // Step 1 — 수신자
  receiver: {
    name: '',       // 수신 업체명
    person: ''      // 담당자명
  },

  // Step 2 — 문서 스타일
  docStyle: 'a',   // 'a' | 'b' | 'c' | 'd'

  // Step 3 — 품목 + 세금
  items: [
    { id: 1, name: '', price: 0, qty: 1 }
  ],
  taxMode: 'normal', // 'normal'(별도10%) | 'include'(포함) | 'zero'(면세)

  // Step 4 — 발신자
  sender: {
    name: '',       // 회사명
    ceo: '',        // 대표자
    bizNum: '',     // 사업자번호 (자동포맷 000-00-00000)
    tel: ''         // 연락처 (자동포맷 010-0000-0000)
  },

  // Step 4 — 자주 쓰는 문구
  memoItems: [
    { id: 1, text: '부가세 별도 (세금계산서 발행 가능)', on: false },
    { id: 2, text: '계약금 50%, 잔금 50% 조건', on: false },
    { id: 3, text: '작업 완료 후 세금계산서 발행', on: false },
    { id: 4, text: '재료비 변동 시 금액 조정 가능', on: false },
    { id: 5, text: '방문 일정 협의 후 진행', on: false },
    { id: 6, text: '샘플 확인 후 최종 견적 확정', on: false },
    { id: 7, text: '무통장 입금 후 작업 시작', on: false },
  ],

  // Step 4 — 도장 (현재 보류, 추후 추가)
  stamp: {
    on: false,
    style: 0,       // 0~11 (12종)
    color: '#dc2626',
    posX: null,
    posY: null
  },

  // Complete — 추가 제안
  extras: {
    date:    { on: false, value: '' },  // 견적 작성일
    bank:    { on: false, value: '' },  // 입금 계좌
    expiry:  { on: false, value: '' },  // 견적 유효기간
    contact: { on: false, value: '' },  // 담당자 연락처
    payment: { on: false, value: '' },  // 결제 조건
  }
}
```

---

## 4. localStorage 저장 규칙

브라우저 단위 영구 저장. 만료 없음.

| 키 | 내용 | 저장 시점 |
|----|------|-----------|
| `qt_sender` | 발신자 정보 (회사명, 대표자 등) | sender 변경 시 즉시 |
| `qt_memos` | 자주 쓰는 문구 배열 | memoItems 변경 시 즉시 |
| `qt_memos_v` | 메모 프리셋 버전 (숫자) | 프리셋 갱신 시 |
| `qt_stamp` | 도장 설정 | stamp 변경 시 즉시 |

**주의:** 삭제된 문구는 즉시 localStorage에 반영되므로 복구 불가.
→ "기본 문구 복원" 버튼으로 기본 프리셋 중 누락된 항목만 다시 추가하는 기능 있음.

---

## 5. 핵심 로직 — 세금 계산

```javascript
// taxMode: 'normal' | 'include' | 'zero'
function calcTax(items, taxMode) {
  const raw = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  if (taxMode === 'include') {
    // 부가세 포함 — 역산
    supply = Math.round(raw / 1.1);
    vat = raw - supply;
    total = raw;
  } else if (taxMode === 'zero') {
    // 면세
    supply = raw;
    vat = 0;
    total = raw;
  } else {
    // 별도 10% (기본)
    supply = raw;
    vat = Math.round(raw * 0.1);
    total = supply + vat;
  }

  return { supply, vat, total, vatLabel };
}
```

---

## 6. 핵심 로직 — 포맷터

```javascript
// 전화번호: 010- 고정, 자동 하이픈
// '01012345678' → '010-1234-5678'
function fmtTel(value) {
  let v = value.replace(/\D/g, '');
  if (!v.startsWith('010')) v = '010';
  v = v.slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 7) return v.slice(0, 3) + '-' + v.slice(3);
  return v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
}

// 사업자번호: 3-2-5 자동 하이픈
// '1234567890' → '123-45-67890'
function fmtBiz(value) {
  const v = value.replace(/\D/g, '').slice(0, 10);
  if (v.length <= 3) return v;
  if (v.length <= 5) return v.slice(0, 3) + '-' + v.slice(3);
  return v.slice(0, 3) + '-' + v.slice(3, 5) + '-' + v.slice(5);
}

// 숫자 천단위 콤마
// 1000000 → '1,000,000'
function fmtNumber(n) {
  return (n || 0).toLocaleString('ko-KR');
}
```

---

## 7. PDF/이미지 내보내기

```javascript
// 방식: html2canvas로 DOM 캡처 → jsPDF로 PDF 생성
// 캡처 설정: scale: 3, 배경 흰색, A4 기준 (210mm x 297mm)
// 파일명: 견적서_{수신업체명}_{YYYYMMDD}.pdf / .png

async function downloadPDF(element, receiverName) {
  const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#fff' });
  const pdf = new jsPDF('p', 'mm', 'a4');
  // 이미지 비율 유지하면서 A4에 맞추고, 페이지 넘침 시 자동 분할
  pdf.save(`견적서_${receiverName}_${date}.pdf`);
}

async function downloadImage(element, receiverName) {
  const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#fff' });
  // PNG로 다운로드
}
```

---

## 8. 상태 관리 함수 목록 (useQuote hook)

| 함수명 | 역할 |
|--------|------|
| `updateReceiver(field, value)` | 수신자 필드 업데이트 |
| `setDocStyle(style)` | 문서 스타일 변경 |
| `addItem()` | 빈 품목 행 추가 |
| `updateItem(id, field, value)` | 품목 필드 업데이트 |
| `deleteItem(id)` | 품목 삭제 |
| `setTaxMode(mode)` | 세금 모드 변경 |
| `updateSender(field, value)` | 발신자 필드 업데이트 |
| `toggleMemo(id)` | 문구 체크/해제 |
| `editMemo(id, text)` | 문구 텍스트 수정 |
| `deleteMemo(id)` | 문구 삭제 |
| `moveMemo(id, dir)` | 문구 순서 이동 (-1: 위, 1: 아래) |
| `addMemo(text)` | 커스텀 문구 추가 |
| `restoreDefaultMemos()` | 삭제된 기본 문구 복원 |
| `updateStamp(updates)` | 도장 설정 변경 |
| `toggleExtra(key)` | 추가 제안 체크/해제 |
| `updateExtra(key, value)` | 추가 제안 값 입력 |
| `resetAll()` | 전체 리셋 (발신자/메모/도장은 유지) |

---

## 9. 문서 템플릿 (DocTemplate)

4가지 스타일을 하나의 컴포넌트에서 분기 렌더링:

| 스타일 | 이름 | 특징 |
|--------|------|------|
| A | 모던 미니멀 | 상단 컬러바, 깔끔한 레이아웃 |
| B | 클래식 비즈 | 중앙 헤더 블록, 전통적 느낌 |
| C | 컬러 프리미엄 | 3색 도트 장식, 초록 강조색 |
| D | 웜 내추럴 | 베이지 배경, 부드러운 톤 |

공통 구성요소:
- 수신/발신 메타 정보
- 품목 테이블 (품목명, 단가, 수량, 금액)
- 합계 박스 (공급가액, 부가세, 합계)
- 특이사항 (체크된 메모 항목)
- 추가 제안 박스 (계좌, 유효기간, 연락처, 결제조건)

---

## 10. CRM 이식 시 고려사항

### 그대로 가져갈 수 있는 것
- 세금 계산 로직 (`calcTax`)
- 포맷터 (`fmtTel`, `fmtBiz`, `fmtNumber`)
- 데이터 구조 (state 스키마)
- 문서 템플릿 렌더링 (DocTemplate)
- PDF/이미지 내보내기 로직

### CRM에 맞게 변경해야 할 것
- **저장 방식**: localStorage → CRM의 DB (거래처별 견적서 저장)
- **수신자 정보**: 직접 입력 → CRM 거래처 목록에서 선택
- **발신자 정보**: localStorage → CRM 로그인 유저 정보 자동 연동
- **발송 기능**: 현재 없음 → CRM에서 이메일/카카오 발송 연동
- **견적서 이력**: 현재 없음 → CRM에서 거래처별 견적서 이력 관리

### 파일 매핑 (원본 → CRM 이식 대상)

```
hooks/useQuote.js       → 상태 관리 (CRM DB 연동으로 변경)
utils/taxCalc.js        → 그대로 복사 가능
utils/formatters.js     → 그대로 복사 가능
utils/pdfExport.js      → 그대로 복사 가능
components/DocTemplate  → 그대로 복사 가능 (CSS 포함)
pages/quote/Step1~4     → CRM UI에 맞게 재구성
pages/quote/Complete    → CRM 발송 기능과 통합
```

---

## 11. CSS 주요 변수 (커스터마이징 참고)

```css
--primary: #2563eb;    /* 메인 컬러 */
--ph: #1d4ed8;         /* 메인 hover */
--text: #1e293b;       /* 기본 텍스트 */
--sub: #64748b;        /* 보조 텍스트 */
--muted: #94a3b8;      /* 비활성 텍스트 */
--border: #e2e8f0;     /* 테두리 */
--bl: #f1f5f9;         /* 밝은 배경 */
--white: #ffffff;
```

CSS 클래스 접두사: `qt-` (quote tool), `doc-` (문서 템플릿), `d` (문서 내부 요소)
