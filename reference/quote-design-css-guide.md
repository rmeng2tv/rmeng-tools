# 견적서 미리보기 CSS 가이드 — 수신/발신 박스 + 특이사항 박스

> 출처: 일타케어 CRM (`assets/css/quote-detail.css`)
> A4 원본(794px) 기준 — `transform: scale()`로 축소되어 표시됩니다.
> 셀렉터 접두어: `sa-*` = 스타일 A, `sb-*` = 스타일 B, `sc-*` = 스타일 C

---

## 공통 — 문서 프레임

```css
.preview-frame {
  background: #d8d8d8;
  border-radius: 12px;
  border: 1px solid #d6d8dd;       /* var(--gray3) */
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  overflow-y: auto;
  max-height: calc(100vh - 160px);
  padding: 20px;
}

.preview-doc {
  width: 794px;                    /* A4 원본 폭 */
  background: #fff;
  box-shadow: 0 4px 32px rgba(0,0,0,.14);
  transform-origin: top left;
  /* scale은 JS에서 동적 계산 */
}
```

---

## 🟣 스타일 A — 모던 미니멀 (인디고 #4f46e5)

### 문서 본체

```css
.sa {
  padding: 56px 64px;
  font-family: 'IBM Plex Sans KR','Noto Sans KR',sans-serif;
  min-height: 1123px;
}
```

### 수신/발신 박스 (좌우 2분할, 단일 외곽선)

```css
.sa-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 32px;
  border: 1px solid #ebebeb;       /* 외곽 단일 보더 */
}
.sa-party { padding: 18px 22px; }
.sa-party + .sa-party {
  border-left: 1px solid #ebebeb;  /* 가운데 세로선 */
}
.sa-party-role {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #4f46e5;
  margin-bottom: 8px;
}
.sa-party-name {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 5px;
}
.sa-party-info {
  font-size: 11px;
  color: #777;
  line-height: 1.9;
}
```

### 특이사항 박스

```css
.sa-memo {
  border: 1px solid #ddd;
  margin-top: 24px;
}
.sa-memo-head {
  padding: 12px 18px;
  background: #f8f8ff;             /* 연한 인디고 배경 */
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sa-memo-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #4f46e5;
}
.sa-memo-cont { font-size: 11px; color: #999; }
.sa-memo-body {
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sa-memo-item {
  font-size: 12px;
  color: #444;
  line-height: 1.7;
  display: flex;
  gap: 8px;
}
.sa-memo-item::before {
  content: '•';
  color: #4f46e5;
  flex-shrink: 0;
}
```

---

## ⚫ 스타일 B — 클래식 비즈 (블랙 #111)

### 문서 본체

```css
.sb-topbar { height: 6px; background: #111; }
.sb-inner {
  padding: 48px 64px;
  font-family: 'Noto Sans KR', sans-serif;
}
.sb-title { font-family: 'Noto Serif KR', serif; }   /* 제목만 명조 */
```

### 수신/발신 박스 (박스 없음, 가운데 세로선)

```css
.sb-parties {
  display: flex;
  margin-top: 24px;
  margin-bottom: 32px;
}
.sb-party { flex: 1; }
.sb-party:first-child { padding-right: 36px; }
.sb-party:last-child {
  padding-left: 36px;
  border-left: 1px solid #ebebeb;
}
.sb-role {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #111;
  padding-bottom: 7px;
  border-bottom: 1px solid #111;   /* 라벨 아래 검정 선 */
  margin-bottom: 10px;
}
.sb-name {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 5px;
}
.sb-info {
  font-size: 11px;
  color: #777;
  line-height: 1.9;
}
```

### 특이사항 박스 (검정 헤더)

```css
.sb-memo {
  border: 1px solid #111;
  margin-top: 24px;
}
.sb-memo-head {
  padding: 11px 18px;
  background: #111;                /* 검정 헤더 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sb-memo-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #fff;
}
.sb-memo-cont { font-size: 11px; color: #777; }
.sb-memo-body {
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #111;
}
.sb-memo-item {
  font-size: 12px;
  color: #444;
  line-height: 1.7;
  display: flex;
  gap: 10px;
}
.sb-memo-item::before {
  content: '—';                    /* em-dash */
  color: #999;
  flex-shrink: 0;
}
```

---

## 🟢 스타일 C — 에메랄드 (#059669)

### 수신/발신 박스 (카드형, 좌측 컬러바)

```css
.sc-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
}
.sc-party {
  padding: 16px 18px;
  background: #f8fffe;             /* 매우 연한 민트 배경 */
  border: 1px solid #d1fae5;
  border-left: 3px solid #d1fae5;
}
.sc-party.send {
  border-left-color: #059669;      /* 발신만 진한 에메랄드 좌측바 */
}
.sc-role {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #059669;
  margin-bottom: 7px;
}
.sc-name {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}
.sc-info {
  font-size: 11px;
  color: #777;
  line-height: 1.9;
}
```

### 특이사항 박스

```css
.sc-memo {
  margin-top: 22px;
  background: #f8fffe;
  border: 1px solid #d1fae5;
  border-radius: 2px;
}
.sc-memo-head {
  padding: 11px 18px;
  border-bottom: 1px solid #d1fae5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sc-memo-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #059669;
}
.sc-memo-cont { font-size: 11px; color: #999; }
.sc-memo-body {
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sc-memo-item {
  font-size: 12px;
  color: #555;
  line-height: 1.7;
  display: flex;
  gap: 8px;
}
.sc-memo-item::before {
  content: '•';
  color: #059669;
  flex-shrink: 0;
}
```

---

## 💡 핵심 포인트 요약

### A4 원본 폭 = 794px
- 모든 padding / font-size는 이 폭 기준
- 축소 표시는 `transform: scale(축소비율)` 사용 (CSS로 줄이지 X)

### 3가지 스타일 키
- `a` — 인디고
- `b` — 블랙 + 명조 제목
- `c` — 에메랄드

### 수신/발신 박스 핵심 차이

| 스타일 | 구조 |
|--------|------|
| **A** | **단일 외곽선 안 좌우 분할** (BG 없음) |
| **B** | **박스 없이** 좌우 영역 + 가운데 세로선 + 위 라벨 아래 검정 선 |
| **C** | **카드 2개 분리** + 발신쪽만 진한 에메랄드 좌측바 |

### 특이사항 박스 핵심 차이

| 스타일 | 구조 |
|--------|------|
| **A** | 흰 박스 + 연한 인디고 헤더 (`#f8f8ff`) |
| **B** | 검정 박스 + 검정 헤더(흰 글씨) + em-dash 불릿 |
| **C** | 민트 박스(`#f8fffe`) + 박스 전체 같은 톤 |
