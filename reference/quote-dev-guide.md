# 견적서 UI/디자인 개발 가이드

> 다른 프로젝트에서도 견적서 작업할 때 복사해서 CLAUDE.md에 붙이거나, reference 폴더에 넣어서 사용하세요.

---

## 1. 핵심 원칙: 미리보기 = 최종 출력물

미리보기 화면과 PDF/이미지 출력물이 **완벽히 동일**해야 한다.

### 방법: A4 원본 + scale() 축소

```
A4 원본(794px) HTML/CSS 1벌만 유지
→ 미리보기: scale()로 패널 폭에 맞게 축소
→ PDF 출력: scale 해제 후 원본 캡처
```

### 절대 하면 안 되는 것

- 미리보기용 축소 CSS를 따로 만드는 것 (폰트 8~12px, 패딩 줄인 별도 스타일)
- 미리보기와 PDF가 다른 HTML 구조를 쓰는 것
- 공통 HTML에 색상만 오버라이드하는 방식 (스타일별로 레이아웃이 다를 때)

### 왜?

축소 CSS를 따로 만들면 미리보기에서는 예뻐 보여도 PDF로 뽑으면 비율이 다르고, 결국 CSS를 2벌 관리하게 되어 수정할 때마다 양쪽 싱크가 깨진다.

---

## 2. CSS 구현 패턴

### 미리보기 프레임 (컨테이너)

```css
.preview-frame {
  background: #d8d8d8;        /* A4 용지가 떠보이는 회색 배경 */
  border-radius: 12px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);
  padding: 20px;
}

.preview-doc {
  width: 794px;               /* A4 원본 폭 고정 */
  background: #fff;
  box-shadow: 0 4px 32px rgba(0,0,0,.14);
  transform-origin: top left;
  /* scale은 JS에서 동적 계산 */
}
```

### 문서 스타일 CSS (A4 원본 사이즈)

```css
/* 폰트: 10~38px, 패딩: 48~64px, min-height: 1123px (A4 높이) */
.sa { padding: 56px 64px; min-height: 1123px; display: flex; flex-direction: column; }
.sa-title { font-size: 34px; font-weight: 700; }
.sa-table td { padding: 12px; font-size: 13px; }
.sa-footer { margin-top: auto; }  /* 푸터는 항상 하단 고정 */
```

---

## 3. JS 구현 패턴

### scale 자동 계산

```javascript
function scalePreview() {
  const frame = document.getElementById('previewDoc');
  if (!frame) return;
  const container = frame.parentElement;
  const containerW = container.clientWidth - 40;  // padding 제외
  const scale = Math.min(containerW / 794, 1);    // 794px 기준
  frame.style.transform = `scale(${scale})`;
  frame.style.transformOrigin = 'top left';
  // 컨테이너 높이도 scale에 맞게 조정 (스크롤 영역)
  container.style.height = (frame.scrollHeight * scale + 40) + 'px';
}

window.addEventListener('resize', scalePreview);
```

### renderPreview() 끝에서 호출

```javascript
function renderPreview() {
  // ... HTML 생성 ...
  frame.innerHTML = `...`;
  scalePreview();  // 렌더링 후 scale 적용
}
```

### PDF/이미지 캡처 시 scale 해제

```javascript
async function downloadPDF() {
  const el = document.getElementById('previewDoc');
  
  // 1) scale 해제 → 794px 원본 상태
  const origTransform = el.style.transform;
  el.style.transform = 'none';
  el.style.width = '794px';
  
  // 2) 캡처
  const canvas = await html2canvas(el, { scale: 2, width: 794 });
  
  // 3) 복원
  el.style.transform = origTransform;
  
  // 4) PDF 생성
  const pdf = new jsPDF('p', 'mm', 'a4');
  // ... addImage, save ...
}
```

---

## 4. Step 2 스타일 선택 카드 패턴

카드 안에 A4 문서 축소 버전을 넣는 방식:

```css
.preview-box {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.mini-doc-wrap {
  width: 794px;
  height: 1123px;
  transform-origin: top left;
  transform: scale(0.224);   /* 794 * 0.224 ≈ 178px */
  position: absolute;
  top: 0; left: 0;
}
```

카드 안의 미니 문서는 **데모 텍스트 하드코딩** (고정), 오른쪽 미리보기는 **state 데이터 동적 바인딩**.

---

## 5. 스타일별 전용 HTML 구조

스타일마다 레이아웃이 다르면 공통 HTML + CSS 오버라이드 방식은 안 된다.
`state.docStyle`에 따라 **완전히 다른 HTML을 생성**해야 한다.

```javascript
function renderPreview() {
  if (state.docStyle === 'a') {
    frame.innerHTML = `<div class="sa">...</div>`;
  } else if (state.docStyle === 'b') {
    frame.innerHTML = `<div class="sb">...</div>`;
  } else {
    frame.innerHTML = `<div class="sc">...</div>`;
  }
  scalePreview();
}
```

### 스타일 예시 (3종)

| 키 | 이름 | 색상 | 폰트 | 특징 |
|----|------|------|------|------|
| a | 모던 미니멀 | 인디고 #4f46e5 | IBM Plex Sans KR | 상단 라벨, 2px 구분선, 보더 파티박스 |
| b | 클래식 비즈 | 블랙 #111 | Noto Serif KR (제목) | 6px 탑바, 세리프 제목, grid 테이블, 블랙 메모헤더 |
| c | 에메랄드 | 에메랄드 #059669 | Noto Sans KR | eyebrow 텍스트, 초록 보더 카드, 초록 배경 메모 |

---

## 6. 회사정보 연동 패턴

견적서 발신자 정보는 하드코딩하지 않고 **시스템 설정 DB에서 로드**:

```javascript
async function loadCompanyInfo() {
  const res = await API.get('admin/settings.php?action=get&group=company');
  if (!res.success) return;
  
  const get = (key) => {
    const s = res.data.settings.find(s => s.setting_key === key);
    return s && s.setting_value ? s.setting_value : '';
  };

  state.sender.name    = get('company_name') || '기본회사명';
  state.sender.ceo     = get('ceo_name');
  state.sender.bizNum  = get('biz_number');
  state.sender.tel     = get('phone');
  state.sender.address = get('address');
  state.sender.stamp   = get('company_stamp');  // 날인 도장 이미지 경로
}
```

### 날인 도장

- 시스템 설정에서 이미지 업로드 → `/assets/uploads/stamp_xxx.png`
- DB `system_settings`에 `company_stamp` 키로 경로 저장
- 견적서 푸터에 `<img class="doc-stamp" src="경로">` 표시
- 도장 없으면 페이지 번호 표시

---

## 7. 폰트 의존성

Google Fonts CDN으로 로드:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700;900&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet">
```

---

## 8. 체크리스트

새 프로젝트에서 견적서 작업 시:

- [ ] CSS는 A4 원본 사이즈(794px) 1벌만 작성했는가?
- [ ] `.preview-doc`에 width:794px 고정, JS에서 scale 동적 계산하는가?
- [ ] PDF 캡처 시 transform:none으로 해제 후 캡처하는가?
- [ ] 스타일별로 다른 HTML 구조를 생성하는가? (공통 HTML 금지)
- [ ] 발신자 정보를 DB에서 로드하는가? (하드코딩 금지)
- [ ] 날인 도장 이미지가 미리보기와 PDF 모두에 표시되는가?
- [ ] Step 2 카드는 794px → scale(0.224) 축소 방식인가?
