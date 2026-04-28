import { fmtTel, fmtBiz } from '../../utils/formatters';

export default function Step1({ state, updateReceiver, setQuoteTitle, onNext }) {
  const { type } = state.receiver;
  const isBiz = type === 'business';

  return (
    <div className="step active">
      <div className="snum">STEP 1 / 4</div>
      <div className="stitle">누구에게 보내는<br />견적서인가요?</div>
      <div className="sdesc">
        <span className="pc-only">개인 고객인지, 사업자인지 먼저 골라주세요.</span>
        <span className="mo-only">개인/사업자를 먼저 골라주세요.</span>
      </div>

      {/* 개인/사업자 토글 */}
      <div className="rtype-toggle">
        <button
          className={`rtype-btn${isBiz ? ' sel' : ''}`}
          onClick={() => updateReceiver('type', 'business')}
        >
          사업자
        </button>
        <button
          className={`rtype-btn${!isBiz ? ' sel' : ''}`}
          onClick={() => updateReceiver('type', 'individual')}
        >
          개인
        </button>
      </div>

      <div className="fg">
        <div>
          <label className="flabel">견적 제목 (선택)</label>
          <input
            className="finput"
            placeholder="예) 사무실 인테리어 시공 견적"
            value={state.quoteTitle}
            onChange={e => setQuoteTitle(e.target.value)}
          />
        </div>
        {isBiz ? (
          <>
            <div>
              <label className="flabel">업체명 *</label>
              <input
                className="finput"
                placeholder="예) (주)알맹이컴퍼니"
                value={state.receiver.name}
                onChange={e => updateReceiver('name', e.target.value)}
              />
            </div>
            <div className="frow">
              <div>
                <label className="flabel">대표자명 (선택)</label>
                <input
                  className="finput"
                  placeholder="예) 김대표"
                  value={state.receiver.ceo}
                  onChange={e => updateReceiver('ceo', e.target.value)}
                />
              </div>
              <div>
                <label className="flabel">담당자명 (선택)</label>
                <input
                  className="finput"
                  placeholder="예) 박과장"
                  value={state.receiver.person}
                  onChange={e => updateReceiver('person', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="flabel">사업자등록번호 (선택)</label>
              <input
                className="finput"
                placeholder="123-45-67890"
                value={state.receiver.bizNum}
                onChange={e => updateReceiver('bizNum', fmtBiz(e.target.value))}
              />
            </div>
          </>
        ) : (
          <div>
            <label className="flabel">고객명 *</label>
            <input
              className="finput"
              placeholder="예) 홍길동"
              value={state.receiver.name}
              onChange={e => updateReceiver('name', e.target.value)}
            />
          </div>
        )}

        <div className="frow">
          <div>
            <label className="flabel">전화번호 (선택)</label>
            <input
              className="finput"
              placeholder="010-0000-0000"
              value={state.receiver.phone}
              onChange={e => updateReceiver('phone', fmtTel(e.target.value))}
            />
          </div>
          <div>
            <label className="flabel">주소 (선택)</label>
            <input
              className="finput"
              placeholder="예) 서울시 강남구 ○○동"
              value={state.receiver.address}
              onChange={e => updateReceiver('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bgrp">
        <button className="bpri" onClick={onNext}>다음 단계 →</button>
      </div>
    </div>
  );
}
