import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './assets/css/style.css'
import App from './App.jsx'

// 토스 미니앱(앱인토스) 빌드 여부 — vite --mode toss 일 때 true
const IS_TOSS = import.meta.env.MODE === 'toss';

// 토스 빌드: 자체 헤더 제거용 클래스 + 핀치 확대축소 비활성화(출시 가이드 요구)
if (IS_TOSS) {
  document.documentElement.classList.add('is-toss');
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// 카카오톡 인앱 브라우저 감지 → 외부 브라우저로 열기 (토스 빌드에선 불필요하므로 제외)
const ua = navigator.userAgent || '';
if (!IS_TOSS && /KAKAOTALK/i.test(ua)) {
  // 카카오톡 자체 스킴으로 외부 브라우저 열기
  window.location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(window.location.href);

  // 스킴이 안 먹힐 경우 대비 안내 표시 (0.5초 후)
  setTimeout(() => {
    document.getElementById('root').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;font-family:-apple-system,'Malgun Gothic',sans-serif;background:#f4f6f9;">
        <div style="text-align:center;max-width:320px;">
          <div style="font-size:20px;font-weight:800;margin-bottom:12px;color:#1e293b;">외부 브라우저에서 열어주세요</div>
          <div style="font-size:14px;color:#64748b;line-height:1.6;margin-bottom:20px;">
            카카오톡 브라우저에서는 일부 기능이 제한됩니다.<br/><br/>
            우측 하단 <b>⋯</b> 메뉴 → <b>다른 브라우저로 열기</b>를 눌러주세요.
          </div>
          <a href="${window.location.href}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
            링크 복사하기
          </a>
        </div>
      </div>
    `;
    // 링크 복사 버튼 동작
    document.querySelector('a').addEventListener('click', function(e) {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.textContent = '복사 완료!';
        this.style.background = '#10b981';
      });
    });
  }, 500);
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}
