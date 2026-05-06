/**
 * OG 이미지 생성 스크립트
 * - SVG로 1200x630 디자인 후 PNG로 변환
 * - 사용: npm run build:og
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';

const logoBuf = fs.readFileSync('src/assets/icons/logo-symbol.png');
const logoB64 = `data:image/png;base64,${logoBuf.toString('base64')}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- 배경 -->
  <rect width="1200" height="630" fill="#ffffff"/>

  <!-- 좌측 영역 (라이트 그레이) -->
  <rect x="0" y="0" width="480" height="630" fill="#f4f6f9"/>

  <!-- 좌측 상단 장식 점 -->
  <circle cx="56" cy="56" r="5" fill="#cbd5e1"/>
  <circle cx="84" cy="56" r="5" fill="#cbd5e1"/>
  <circle cx="112" cy="56" r="5" fill="#cbd5e1"/>

  <!-- 심볼 로고 -->
  <image href="${logoB64}" x="120" y="155" width="320" height="320" preserveAspectRatio="xMidYMid meet"/>

  <!-- 우측 라벨 -->
  <rect x="540" y="218" width="48" height="3" fill="#2563eb"/>
  <text x="600" y="230" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-size="20" font-weight="700" fill="#2563eb" letter-spacing="3">FREE BUSINESS TOOLS</text>

  <!-- 우측 큰 제목 -->
  <text x="540" y="330" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-size="92" font-weight="800" fill="#1a2332">알맹이툴즈</text>

  <!-- 슬로건 (2줄) -->
  <text x="540" y="400" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-size="30" font-weight="500" fill="#475569">알맹이만 쏙 뽑은</text>
  <text x="540" y="442" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-size="30" font-weight="500" fill="#475569">무료 비즈니스 도구</text>

  <!-- 하단 도메인 -->
  <text x="540" y="560" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-size="20" font-weight="600" fill="#94a3b8">tools.rmeng2.co.kr</text>
</svg>`;

fs.writeFileSync('public/og-image.svg', svg);

const resvg = new Resvg(svg, {
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Malgun Gothic',
  },
  background: '#ffffff',
});

const pngBuffer = resvg.render().asPng();
fs.writeFileSync('public/og-image.png', pngBuffer);

console.log(`✓ OG image generated (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
console.log('  → public/og-image.png');
console.log('  → public/og-image.svg');
