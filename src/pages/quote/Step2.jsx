const STYLES = [
  {
    id: 'a',
    name: '모던 미니멀',
    tag: '스타트업 · 프리랜서',
    preview: (
      <div className="mp">
        <div className="mp-bar" />
        <div className="mp-title" />
        <div className="mp-row">
          <div className="mp-cell" style={{ background: '#f1f5f9', flex: 3 }} />
          <div className="mp-cell" style={{ background: '#f1f5f9', flex: 1 }} />
        </div>
        <div className="mp-row">
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 3 }} />
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 1 }} />
        </div>
        <div className="mp-row">
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 3 }} />
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
          <div style={{ width: 44, height: 9, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 3 }} />
        </div>
      </div>
    ),
  },
  {
    id: 'b',
    name: '클래식 비즈',
    tag: '기업 · 관공서',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="mp-bh">
          <div style={{ width: 24, height: 3, background: 'rgba(255,255,255,.7)', borderRadius: 1 }} />
          <div style={{ width: 16, height: 3, background: 'rgba(255,255,255,.4)', borderRadius: 1 }} />
        </div>
        <div className="mp" style={{ paddingTop: 6 }}>
          <div className="mp-row">
            <div className="mp-cell" style={{ background: '#f1f5f9', flex: 3 }} />
            <div className="mp-cell" style={{ background: '#f1f5f9', flex: 1 }} />
          </div>
          <div className="mp-row">
            <div className="mp-cell" style={{ background: '#e2e8f0', flex: 3 }} />
            <div className="mp-cell" style={{ background: '#e2e8f0', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <div style={{ width: 44, height: 9, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'c',
    name: '컬러 프리미엄',
    tag: '에이전시 · 크리에이터',
    preview: (
      <div className="mp">
        <div className="mp-dots">
          <div className="mp-dot" style={{ background: '#2563eb' }} />
          <div className="mp-dot" style={{ background: '#10b981' }} />
          <div className="mp-dot" style={{ background: '#f59e0b' }} />
        </div>
        <div className="mp-title" />
        <div className="mp-row">
          <div className="mp-cell" style={{ background: '#f1f5f9', flex: 3 }} />
          <div className="mp-cell" style={{ background: '#f1f5f9', flex: 1 }} />
        </div>
        <div className="mp-row">
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 3 }} />
          <div className="mp-cell" style={{ background: '#e2e8f0', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <div style={{ width: 44, height: 9, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 3 }} />
        </div>
      </div>
    ),
  },
];

export default function Step2({ state, setDocStyle, onPrev, onNext }) {
  return (
    <div className="step active">
      <div className="snum">STEP 2 / 4</div>
      <div className="stitle">어떤 스타일로<br />만들까요?</div>
      <div className="sdesc">클릭하면 오른쪽 미리보기가 바로 바뀌어요.</div>
      <div className="scards">
        {STYLES.map(s => (
          <div
            key={s.id}
            className={`scard${state.docStyle === s.id ? ' sel' : ''}`}
            onClick={() => setDocStyle(s.id)}
          >
            <div className="spbox">{s.preview}</div>
            <div className="scard-name">{s.name}</div>
            <div className="scard-tag">{s.tag}</div>
          </div>
        ))}
      </div>
      <div className="bgrp">
        <button className="bback" onClick={onPrev}>이전</button>
        <button className="bpri" onClick={onNext}>다음 단계 →</button>
      </div>
    </div>
  );
}
