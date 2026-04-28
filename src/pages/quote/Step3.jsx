import { calcTax } from '../../utils/taxCalc';
import { fmtNumber } from '../../utils/formatters';

const TAX_OPTIONS = [
  {
    mode: 'include',
    icon: '🧾',
    title: '부가세 포함으로 처리할게요',
    desc: '입력한 금액 안에 세금이 이미 포함된 경우',
  },
  {
    mode: 'zero',
    icon: '✅',
    title: '부가세 0원으로 할게요',
    desc: '면세 품목이거나 세금계산서 미발행인 경우',
  },
  {
    mode: 'normal',
    icon: '👍',
    title: '지금 이대로가 좋아요',
    desc: '공급가액에 부가세 10% 별도 추가',
  },
];

export default function Step3({
  state,
  addItem,
  updateItem,
  deleteItem,
  setTaxMode,
  toggleShowSpec,
  onPrev,
  onNext,
}) {
  const { supply, vat, total, vatLabel } = calcTax(state.items, state.taxMode);
  const showSpec = state.showSpec;

  return (
    <div className="step active">
      <div className="snum">STEP 3 / 4</div>
      <div className="stitle">어떤 서비스를 제공하나요?</div>
      <div className="sdesc"><span className="pc-only">품목을 추가하면 오른쪽 견적서가 실시간으로 채워져요.</span><span className="mo-only">품목과 금액을 입력해주세요.</span></div>

      {/* 규격 컬럼 토글 */}
      <label className="spec-toggle">
        <input
          type="checkbox"
          checked={showSpec}
          onChange={toggleShowSpec}
        />
        <span>규격 컬럼 표시 <span className="spec-toggle-hint">(예: 모델명, 사이즈 등 별도 표기)</span></span>
      </label>

      {/* 품목 테이블 */}
      <div className={`itbl${showSpec ? ' with-spec' : ''}`}>
        <div className="ihdr">
          <span>품목명</span>
          {showSpec && <span>규격</span>}
          <span>단가</span>
          <span>수량</span>
          <span style={{ textAlign: 'right' }}>금액</span>
          <span />
        </div>
        <div className="irows">
          {state.items.map(item => {
            const amt = (item.price || 0) * (item.qty || 1);
            return (
              <div className="irow" key={item.id}>
                <input
                  className="iinput"
                  placeholder="품목명"
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                />
                {showSpec && (
                  <input
                    className="iinput"
                    placeholder="규격"
                    value={item.spec || ''}
                    onChange={e => updateItem(item.id, 'spec', e.target.value)}
                  />
                )}
                <input
                  className="iinput num"
                  placeholder="0"
                  type="number"
                  min="0"
                  value={item.price || ''}
                  onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                />
                <input
                  className="iinput num"
                  placeholder="1"
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                />
                <div className="itotal">
                  {item.price ? fmtNumber(amt) + '원' : '—'}
                </div>
                <button className="idel" onClick={() => deleteItem(item.id)}>&times;</button>
              </div>
            );
          })}
        </div>
      </div>

      <button className="addbtn" onClick={addItem}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
        품목 추가
      </button>

      {/* 세금 박스 */}
      <div className="taxbox">
        <div className="taxrow">
          <span>공급가액</span>
          <span>{fmtNumber(supply)}원</span>
        </div>
        <div className="taxrow">
          <span>{vatLabel}</span>
          <span>{fmtNumber(vat)}원</span>
        </div>
        <div className="taxrow tot">
          <span>합계</span>
          <span className="amt">{fmtNumber(total)}원</span>
        </div>

        <div className="tax-guide">
          <p className="tax-guide-q">
            부가세가 자동으로 계산됐어요.<br />
            혹시 아래 경우에 해당하시나요?
          </p>
          <div className="tax-opts">
            {TAX_OPTIONS.map(opt => (
              <button
                key={opt.mode}
                className={`tax-opt${state.taxMode === opt.mode ? ' sel' : ''}`}
                onClick={() => setTaxMode(opt.mode)}
              >
                <span className="tax-opt-icon">{opt.icon}</span>
                <div className="tax-opt-text">
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bgrp">
        <button className="bback" onClick={onPrev}>이전</button>
        <button className="bpri" onClick={onNext}>다음 단계 →</button>
      </div>
    </div>
  );
}
