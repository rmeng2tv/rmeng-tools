export default function Step1({ state, updateReceiver, onNext }) {
  return (
    <div className="step active">
      <div className="snum">STEP 1 / 4</div>
      <div className="stitle">누구에게 보내는<br />견적서인가요?</div>
      <div className="sdesc"><span className="pc-only">수신 업체명만 입력해도 견적서가 채워지기 시작해요.</span><span className="mo-only">수신 업체명부터 시작해볼까요?</span></div>
      <div className="fg">
        <div>
          <label className="flabel">수신 업체명 *</label>
          <input
            className="finput"
            placeholder="예) (주)알맹이컴퍼니"
            value={state.receiver.name}
            onChange={e => updateReceiver('name', e.target.value)}
          />
        </div>
        <div>
          <label className="flabel">담당자명 (선택)</label>
          <input
            className="finput"
            placeholder="예) 홍길동 팀장"
            value={state.receiver.person}
            onChange={e => updateReceiver('person', e.target.value)}
          />
        </div>
      </div>
      <div className="bgrp">
        <button className="bpri" onClick={onNext}>다음 단계 →</button>
      </div>
    </div>
  );
}
