import { useState, useEffect, useRef } from 'react';

// 0부터 target까지 올라가는 카운터 (easeOutCubic, 약 1.2초)
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    let raf;
    function tick(now) {
      if (startRef.current === null) startRef.current = now;
      const progress = Math.min((now - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function TrustBar() {
  const count = useCountUp(1247);
  const time = useCountUp(28);
  const percent = useCountUp(100);

  return (
    <aside className="trustbar">
      <div className="tb-item">
        <div className="tb-num">{count.toLocaleString()}</div>
        <div className="tb-label">지금까지<br />만들어진 견적서</div>
      </div>
      <div className="tb-divider" />
      <div className="tb-item">
        <div className="tb-num">{time}초</div>
        <div className="tb-label">평균 작성 시간</div>
      </div>
      <div className="tb-divider" />
      <div className="tb-item">
        <div className="tb-num">{percent}%</div>
        <div className="tb-label">무료 · 로그인 없음</div>
      </div>
    </aside>
  );
}
