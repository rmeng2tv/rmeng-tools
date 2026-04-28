import { useRef, useState, useEffect, useCallback } from 'react';
import DocTemplate from './DocTemplate';

const A4_WIDTH = 794;
const PADDING = 40; // .preview-frame 좌우 padding 합계 (20px * 2)

export default function PreviewPanel({ state, currentStep }) {
  const { receiver, sender, items } = state;
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // 컨테이너 폭 기준 scale + 컨테이너 높이 동적 계산
  const calcScale = useCallback(() => {
    if (!containerRef.current || !frameRef.current) return;
    const containerW = containerRef.current.clientWidth - PADDING;
    const s = Math.min(containerW / A4_WIDTH, 1);
    setScale(s);

    // 축소된 만큼 컨테이너 높이도 재계산 (스크롤 영역)
    const docH = frameRef.current.scrollHeight;
    containerRef.current.style.height = (docH * s + PADDING) + 'px';
  }, []);

  useEffect(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, [calcScale]);

  // state 변동 시에도 높이 재계산 (품목 추가/삭제 등)
  useEffect(() => {
    calcScale();
  }, [state, calcScale]);

  // 진행도 상태 텍스트
  const filled = [receiver.name, sender.name].filter(Boolean).length
    + (items.some(i => i.name) ? 1 : 0);
  const statusText =
    filled === 0 ? '입력 중...' :
    filled === 1 ? '조금 더...' :
    filled === 2 ? '절반 완성!' :
    '거의 다 됐어요!';

  return (
    <div className="pvpanel">
      <div className="pvhdr">
        <span className="pvlabel">실시간 미리보기</span>
        <span className="pvst">{statusText}</span>
      </div>
      <div className="pvbody preview-frame" ref={containerRef}>
        <div
          className="preview-doc"
          ref={frameRef}
          style={{
            width: A4_WIDTH,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          <DocTemplate state={state} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
}
