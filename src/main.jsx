import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import App from './App.jsx'

// 카카오톡 인앱 브라우저 감지 → 외부 브라우저로 열기
const ua = navigator.userAgent || '';
if (/KAKAOTALK/i.test(ua)) {
  const url = encodeURIComponent(window.location.href);
  // 안드로이드: intent 방식, iOS: safari 방식
  if (/android/i.test(ua)) {
    window.location.href = 'intent://' + window.location.href.replace(/https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
  } else {
    // iOS에서는 자동 리다이렉트가 어려워서 안내 표시
    document.getElementById('root').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;font-family:-apple-system,sans-serif;background:#f4f6f9;">
        <div style="text-align:center;max-width:320px;">
          <div style="font-size:20px;font-weight:800;margin-bottom:12px;color:#1e293b;">외부 브라우저에서 열어주세요</div>
          <div style="font-size:14px;color:#64748b;line-height:1.6;margin-bottom:20px;">
            카카오톡 내 브라우저에서는 일부 기능이 제한됩니다.<br/>
            우측 상단 <b>⋮</b> 메뉴 → <b>다른 브라우저로 열기</b>를 눌러주세요.
          </div>
        </div>
      </div>
    `;
  }
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
