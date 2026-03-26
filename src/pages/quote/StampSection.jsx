import { useEffect, useRef, useCallback } from 'react';
import { STAMPS, drawStamp } from '../../components/StampCanvas';

const COLORS = [
  { value: '#dc2626', label: '빨간색' },
  { value: '#1d4ed8', label: '파란색' },
  { value: '#1e293b', label: '검정' },
  { value: '#7c3aed', label: '보라' },
];

export default function StampSection({ stamp, senderName, senderCeo, updateStamp }) {
  return (
    <div className="stamp-section">
      <label className="stamp-toggle-row">
        <input
          type="checkbox"
          checked={stamp.on}
          onChange={e => updateStamp({ on: e.target.checked })}
        />
        <span className="stamp-toggle-label">가상 도장 삽입하기 (선택)</span>
      </label>

      <div className={`stamp-body${stamp.on ? ' open' : ''}`}>
        <div className="stamp-desc">
          스타일을 선택하면 회사명·대표자명이 자동 반영돼요.
          프리뷰에서 드래그로 위치를 바꿀 수 있어요.
        </div>

        {/* 12종 그리드 */}
        <div className="stamp-grid">
          {STAMPS.map((s, i) => (
            <StampCard
              key={i}
              index={i}
              name={s.name}
              selected={stamp.style === i}
              color={stamp.color}
              t1={senderName || '회사명'}
              t2={senderCeo || '대표자'}
              onClick={() => updateStamp({ style: i })}
            />
          ))}
        </div>

        {/* 색상 선택 */}
        <div className="stamp-colors">
          <span className="sc-label">색상</span>
          {COLORS.map(c => (
            <div
              key={c.value}
              className={`scol${stamp.color === c.value ? ' sel' : ''}`}
              style={{ background: c.value }}
              title={c.label}
              onClick={() => updateStamp({ color: c.value })}
            />
          ))}
        </div>

        <div className="stamp-edit-note">
          선택한 도장 스타일은 PDF 출력 시 그대로 반영돼요.
        </div>
      </div>
    </div>
  );
}

/* ── 도장 카드 (미니 캔버스) ── */
function StampCard({ index, name, selected, color, t1, t2, onClick }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    if (canvasRef.current) {
      drawStamp(canvasRef.current, index, t1, t2, color);
    }
  }, [index, t1, t2, color]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className={`stamp-card${selected ? ' sel' : ''}`} onClick={onClick}>
      <canvas ref={canvasRef} width={64} height={64} />
      <div className="stamp-card-name">{name}</div>
    </div>
  );
}
