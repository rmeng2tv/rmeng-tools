const SUGGESTIONS = [
  { key: 'bank', name: '입금 계좌 정보', desc: '선택 시 견적서 하단에 별도 박스로 표시', placeholder: '예) 국민은행 123-456-789 (홍길동)' },
  { key: 'expiry', name: '견적 유효기간', desc: '선택 시 견적서 하단에 별도 박스로 표시', placeholder: '예) 발행일로부터 30일' },
  { key: 'contact', name: '담당자 직통 연락처', desc: '선택 시 견적서 하단에 별도 박스로 표시', placeholder: '예) 010-0000-0000' },
  { key: 'payment', name: '결제 조건', desc: '선택 시 견적서 하단에 별도 박스로 표시', placeholder: '예) 계약금 50%, 잔금 50%' },
];

export default function Complete({ show, state, toggleExtra, updateExtra, onDownloadPDF, onDownloadImage, onRedo }) {
  if (!show) return null;

  return (
    <div className="overlay show">
      <div className="ocard">
        <div className="oicon">&#10003;</div>
        <div className="otitle">견적서 완성!</div>
        <div className="odesc">
          아래 정보를 추가하면 견적서가 더 전문적으로 보여요.<br />
          체크한 항목은 견적서 하단 별도 섹션에 자동으로 추가돼요.
        </div>

        <div className="sug-section-title">추가 정보 (선택)</div>
        <div className="sug-list">
          {SUGGESTIONS.map(sug => {
            const extra = state.extras[sug.key];
            return (
              <div
                key={sug.key}
                className={`sug-item${extra.on ? ' on' : ''}`}
                onClick={() => toggleExtra(sug.key)}
              >
                <div className="sug-top">
                  <div className="sug-check">{extra.on ? '\u2713' : ''}</div>
                  <div className="sug-name">{sug.name}</div>
                </div>
                <div className="sug-desc">{sug.desc}</div>
                <div className="sug-input-wrap">
                  <input
                    className="sug-input"
                    placeholder={sug.placeholder}
                    value={extra.value}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateExtra(sug.key, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 다운로드 버튼 2개 */}
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
        <div className="adnotice">광고 1회 시청 후 무료 다운로드 (준비 중)</div>
        <button className="bredo" onClick={onRedo}>처음부터 다시 만들기</button>
      </div>
    </div>
  );
}
