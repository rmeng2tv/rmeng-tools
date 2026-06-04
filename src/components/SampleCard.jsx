import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DocTemplate from './DocTemplate';

const A4_WIDTH = 794;

// 견적서 샘플 1종을 카드 폭에 맞게 축소해서 보여준다.
// 카드 전체가 /?style=X 링크 → 클릭 시 그 스타일이 선택된 채로 작성 시작.
export default function SampleCard({ sample }) {
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [stageH, setStageH] = useState(0);

  const calcScale = useCallback(() => {
    if (!stageRef.current || !frameRef.current) return;
    const stageW = stageRef.current.clientWidth;
    const s = Math.min(stageW / A4_WIDTH, 1);
    setScale(s);
    setStageH(frameRef.current.scrollHeight * s);
  }, []);

  useEffect(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
    // 스타일 A는 페이지 분할이 비동기로 끝나 높이가 늦게 바뀜 → ResizeObserver로 추적
    const ro = new ResizeObserver(calcScale);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => {
      window.removeEventListener('resize', calcScale);
      ro.disconnect();
    };
  }, [calcScale]);

  return (
    <Link to={`/?style=${sample.style}`} className="sample-card">
      <div className="sample-stage" ref={stageRef} style={{ height: stageH }}>
        <div
          className="sample-doc"
          ref={frameRef}
          style={{
            width: A4_WIDTH,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          <DocTemplate state={sample.state} currentStep={4} />
        </div>
      </div>
      <div className="sample-meta">
        <div className="sample-name">{sample.label}</div>
        <div className="sample-desc">{sample.desc}</div>
        <span className="sample-go">이 스타일로 만들기 →</span>
      </div>
    </Link>
  );
}
