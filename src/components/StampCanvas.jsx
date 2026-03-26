// 도장 12종 Canvas 렌더링
// 시안(reference/quote-wizard.html)의 draw 함수들을 그대로 이식

export const STAMPS = [
  { name: '원형\n단선' },
  { name: '원형\n이중선' },
  { name: '원형\n내부선' },
  { name: '원형\n별장식' },
  { name: '원형\n도트테두리' },
  { name: '사각\n직인' },
  { name: '사각\n이중선' },
  { name: '둥근\n사각형' },
  { name: '타원형' },
  { name: '낙관형\n(이름)' },
  { name: '다이아\n형' },
  { name: '팔각형' },
];

/**
 * 도장 그리기 메인 함수
 * @param {HTMLCanvasElement} cv
 * @param {number} styleIndex - 0~11
 * @param {string} t1 - 회사명
 * @param {string} t2 - 대표자
 * @param {string} c - 색상
 */
export function drawStamp(cv, styleIndex, t1, t2, c) {
  const drawFns = [
    drawCircle1, drawCircle2, drawCircle3, drawCircleStar, drawCircleDot,
    drawRect, drawRect2, drawRoundRect, drawEllipse, drawLogo,
    drawDiamond, drawOctagon,
  ];
  if (drawFns[styleIndex]) {
    drawFns[styleIndex](cv, t1, t2, c);
  }
}

// ── 개별 도장 그리기 함수들 ──

function drawCircle1(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 5;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 8);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 8);
}

function drawCircle2(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 3;
  x.beginPath(); x.arc(cx, cy, w / 2 - 4, 0, Math.PI * 2); x.stroke();
  x.lineWidth = 1;
  x.beginPath(); x.arc(cx, cy, w / 2 - 9, 0, Math.PI * 2); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 7);
}

function drawCircle3(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 5;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2;
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 10px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 10);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 10);
}

function drawCircleStar(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 5;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '10px serif'; x.fillText('\u2605', cx, cy - 18);
  x.font = 'bold 10px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 4);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 9);
}

function drawCircleDot(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 6;
  x.clearRect(0, 0, w, h);
  x.fillStyle = c;
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2, dx = cx + (r + 4) * Math.cos(a), dy = cy + (r + 4) * Math.sin(a);
    x.beginPath(); x.arc(dx, dy, 1.5, 0, Math.PI * 2); x.fill();
  }
  x.strokeStyle = c; x.lineWidth = 1.5;
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 7);
}

function drawRect(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5; x.strokeRect(5, 5, w - 10, h - 10);
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), w / 2, h / 2 - 8);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), w / 2, h / 2 + 8);
}

function drawRect2(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 3; x.strokeRect(4, 4, w - 8, h - 8);
  x.lineWidth = 1; x.strokeRect(8, 8, w - 16, h - 16);
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), w / 2, h / 2 - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), w / 2, h / 2 + 7);
}

function drawRoundRect(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.roundRect(5, 5, w - 10, h - 10, 10); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), w / 2, h / 2 - 8);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), w / 2, h / 2 + 8);
}

function drawEllipse(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.ellipse(cx, cy, w / 2 - 5, h / 2 - 9, 0, 0, Math.PI * 2); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 11px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 7);
}

function drawLogo(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 4;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.lineWidth = 1;
  x.beginPath(); x.arc(cx, cy, r - 6, 0, Math.PI * 2); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  const name = t2.slice(0, 2);
  x.font = `bold ${name.length < 2 ? 22 : 18}px Pretendard,sans-serif`;
  x.fillText(name, cx, cy);
}

function drawDiamond(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(cx, 5); x.lineTo(w - 5, cy); x.lineTo(cx, h - 5); x.lineTo(5, cy); x.closePath(); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 10px Pretendard,sans-serif'; x.fillText(t1.slice(0, 4), cx, cy - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 7);
}

function drawOctagon(cv, t1, t2, c) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, r = w / 2 - 5;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = c; x.lineWidth = 2.5;
  x.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 - Math.PI / 8;
    const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
    i === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
  }
  x.closePath(); x.stroke();
  x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = 'bold 10px Pretendard,sans-serif'; x.fillText(t1.slice(0, 5), cx, cy - 7);
  x.font = '9px Pretendard,sans-serif'; x.fillText(t2.slice(0, 4), cx, cy + 7);
}
