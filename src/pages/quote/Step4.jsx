import { useState, useRef } from 'react';
import { fmtTel, fmtBiz } from '../../utils/formatters';
import StampSection from './StampSection';

export default function Step4({
  state,
  updateSender,
  toggleMemo,
  editMemo,
  moveMemo,
  addMemo,
  updateStamp,
  onPrev,
  onFinish,
}) {
  const [customText, setCustomText] = useState('');

  function handleAddCustom() {
    if (!customText.trim()) return;
    addMemo(customText);
    setCustomText('');
  }

  return (
    <div className="step active">
      <div className="snum">STEP 4 / 4</div>
      <div className="stitle">마지막이에요!<br />내 회사 정보만 입력하면 완성</div>
      <div className="sdesc">한 번 입력하면 다음엔 자동으로 불러와요.</div>

      {/* 발신자 정보 */}
      <div className="fg">
        <div className="frow">
          <div>
            <label className="flabel">회사명</label>
            <input
              className="finput"
              placeholder="(주)알맹이"
              value={state.sender.name}
              onChange={e => updateSender('name', e.target.value)}
            />
          </div>
          <div>
            <label className="flabel">대표자</label>
            <input
              className="finput"
              placeholder="홍길동"
              value={state.sender.ceo}
              onChange={e => updateSender('ceo', e.target.value)}
            />
          </div>
        </div>
        <div className="frow">
          <div>
            <label className="flabel">사업자번호</label>
            <input
              className="finput"
              placeholder="000-00-00000"
              maxLength={12}
              value={state.sender.bizNum}
              onChange={e => updateSender('bizNum', fmtBiz(e.target.value))}
            />
          </div>
          <div>
            <label className="flabel">연락처</label>
            <input
              className="finput"
              placeholder="010-0000-0000"
              maxLength={13}
              value={state.sender.tel || '010-'}
              onChange={e => updateSender('tel', fmtTel(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 메모 프리셋 */}
      <div className="preset-section">
        <div className="preset-header">
          <div className="preset-title">자주 쓰는 문구</div>
          <div className="preset-edit-badge">클릭해서 수정 가능</div>
        </div>
        <div className="preset-hint">
          박스를 클릭하면 체크돼요. 문구 텍스트를 직접 클릭하면 수정할 수 있어요.
        </div>
        <div className="preset-list">
          {state.memoItems.map(memo => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onToggle={() => toggleMemo(memo.id)}
              onEdit={text => editMemo(memo.id, text)}
              onMove={dir => moveMemo(memo.id, dir)}
            />
          ))}
        </div>
        <div className="custom-input-row">
          <input
            className="custom-input"
            placeholder="직접 입력하세요..."
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <button className="custom-add-btn" onClick={handleAddCustom}>+ 추가</button>
        </div>
      </div>

      {/* 도장 (독립 섹션 — 추후 수정/삭제 용이) */}
      <StampSection
        stamp={state.stamp}
        senderName={state.sender.name}
        senderCeo={state.sender.ceo}
        updateStamp={updateStamp}
      />

      <div className="bgrp">
        <button className="bback" onClick={onPrev}>이전</button>
        <button className="bpri" onClick={onFinish}>견적서 완성하기</button>
      </div>
    </div>
  );
}

/* ── 메모 아이템 (내부 컴포넌트) ── */
function MemoItem({ memo, onToggle, onEdit, onMove }) {
  const textRef = useRef(null);

  function handleClick(e) {
    if (e.target.closest('[contentEditable]') || e.target.closest('.obtn')) return;
    onToggle();
  }

  return (
    <div className={`pitem${memo.on ? ' on' : ''}`} onClick={handleClick}>
      <div className="pitem-row">
        <div className="pcheck">{memo.on ? '\u2713' : ''}</div>
        <div className="ptext-wrap">
          <div
            className="ptext"
            contentEditable
            suppressContentEditableWarning
            ref={textRef}
            onClick={e => e.stopPropagation()}
            onFocus={e => e.stopPropagation()}
            onBlur={() => {
              if (textRef.current) onEdit(textRef.current.textContent);
            }}
          >
            {memo.text}
          </div>
          <div className="edit-hint">텍스트를 클릭해서 수정해보세요</div>
        </div>
        <div className="porder">
          <button className="obtn" onClick={e => { e.stopPropagation(); onMove(-1); }}>&#9650;</button>
          <button className="obtn" onClick={e => { e.stopPropagation(); onMove(1); }}>&#9660;</button>
        </div>
      </div>
    </div>
  );
}
