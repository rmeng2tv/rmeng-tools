import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 콘솔에 등록한 appName과 반드시 동일해야 해요. (딥링크 intoss://rmeng-quote)
  appName: 'rmeng-quote',
  appType: 'general', // 비게임
  brand: {
    displayName: '알맹이 견적서 메이커', // 콘솔에 등록한 한국어 앱 이름
    primaryColor: '#2563eb', // 앱 대표 색상 (우리 파란 버튼색)
    icon: '', // 콘솔에 로고 업로드 후 이미지 URL을 여기에 입력
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      // --mode toss → 코드에서 import.meta.env.MODE === 'toss'로 토스 전용 분기
      // --host 0.0.0.0 → IPv4에도 바인딩(adb reverse가 127.0.0.1로 접속하므로 필수)
      dev: 'vite --mode toss --host 0.0.0.0',
      build: 'vite build --mode toss',
    },
  },
  permissions: [], // 견적서 툴은 카메라/위치 등 권한 불필요
  outdir: 'dist',
});
