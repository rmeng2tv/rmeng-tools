import { useState } from 'react';

// 오늘 날짜 (YYYY-MM-DD)
const today = new Date().toISOString().slice(0, 10);

const DEFAULT_SUGGESTIONS = [
  { key: 'bank', name: '입금 계좌 정보', desc: '선택 시 견적서 하단에 별도 박스로 표시', defaultValue: '국민은행 123-456-789 (홍길동)', inputType: 'text' },
  { key: 'expiry', name: '견적 유효기간', desc: '선택 시 견적서 하단에 별도 박스로 표시', defaultValue: '발행일로부터 30일', inputType: 'text' },
  { key: 'contact', name: '담당자 직통 연락처', desc: '선택 시 견적서 하단에 별도 박스로 표시', defaultValue: '010-0000-0000', inputType: 'text' },
];

export default function Complete({ show, state, toggleExtra, updateExtra, reorderExtras, onDownloadPDF, onDownloadImage, onBack }) {
  const [order, setOrder] = useState(() => DEFAULT_SUGGESTIONS.map(s => s.key));

  if (!show) return null;

  function handleToggle(sug) {
    const extra = state.extras[sug.key];
    if (!extra.on && !extra.value) {
      updateExtra(sug.key, sug.defaultValue);
    }
    toggleExtra(sug.key);
  }

  function moveItem(key, dir) {
    setOrder(prev => {
      const list = [...prev];
      const idx = list.indexOf(key);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= list.length) return prev;
      [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      return list;
    });
  }

  const orderedSuggestions = order.map(key => DEFAULT_SUGGESTIONS.find(s => s.key === key));

  return (
    <div className="overlay show" onClick={onBack}>
      <div className="ocard" onClick={e => e.stopPropagation()}>
        <div className="oicon">&#10003;</div>
        <div className="otitle">견적서 완성!</div>
        <div className="odesc">
          아래 정보를 추가하면 견적서가 더 전문적으로 보여요.<br />
          체크한 항목은 견적서 하단 별도 섹션에 자동으로 추가돼요.
        </div>

        <div className="sug-section-title">추가 정보 (선택)</div>
        <div className="sug-list">
          {/* 견적 작성일 변경 */}
          <div
            className={`sug-item${state.extras.date?.on ? ' on' : ''}`}
            onClick={() => {
              if (!state.extras.date?.on && !state.extras.date?.value) {
                updateExtra('date', today);
              }
              toggleExtra('date');
            }}
          >
            <div className="sug-top">
              <div className="sug-check">{state.extras.date?.on ? '\u2713' : ''}</div>
              <div className="sug-name" style={{ flex: 1 }}>견적 작성일 변경</div>
            </div>
            <div className="sug-desc">기본값은 오늘 날짜. 선택 시 달력에서 변경 가능</div>
            <div className="sug-input-wrap">
              <input
                className="sug-input"
                type="date"
                value={state.extras.date?.value || today}
                onClick={e => e.stopPropagation()}
                onChange={e => updateExtra('date', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="sug-list">
          {orderedSuggestions.map(sug => {
            const extra = state.extras[sug.key];
            return (
              <div
                key={sug.key}
                className={`sug-item${extra.on ? ' on' : ''}`}
                onClick={() => handleToggle(sug)}
              >
                <div className="sug-top">
                  <div className="sug-check">{extra.on ? '\u2713' : ''}</div>
                  <div className="sug-name" style={{ flex: 1 }}>{sug.name}</div>
                  <div className="porder" onClick={e => e.stopPropagation()}>
                    <button className="obtn" onClick={() => moveItem(sug.key, -1)}>&#9650;</button>
                    <button className="obtn" onClick={() => moveItem(sug.key, 1)}>&#9660;</button>
                  </div>
                </div>
                <div className="sug-desc">{sug.desc}</div>
                <div className="sug-input-wrap">
                  <input
                    className="sug-input"
                    value={extra.value}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateExtra(sug.key, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button className="bdl" onClick={onDownloadPDF}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          PDF 저장하기
        </button>
        <button className="bdl" style={{ background: '#10b981' }} onClick={onDownloadImage}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          이미지 저장하기
        </button>
        <button className="bredo" onClick={onBack}>이전</button>
      </div>
    </div>
  );
}
