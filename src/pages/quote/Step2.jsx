import DocTemplate from '../../components/DocTemplate';

// 카드 안에서만 사용하는 데모 데이터 (하드코딩, 고정)
const DEMO_STATE = {
  receiver: {
    type: 'business',
    name: '(주)알맹이컴퍼니',
    ceo: '김대표',
    person: '박과장',
    bizNum: '123-45-67890',
    phone: '010-1234-5678',
    address: '서울시 강남구',
  },
  quoteTitle: '사무실 인테리어 시공',
  showSpec: false,
  items: [
    { id: 1, name: '벽면 도장 작업', spec: '', price: 500000, qty: 1 },
    { id: 2, name: '바닥 시공', spec: '', price: 800000, qty: 1 },
    { id: 3, name: '조명 교체', spec: '', price: 300000, qty: 2 },
  ],
  taxMode: 'normal',
  sender: {
    name: '리메이크 컴퍼니',
    ceo: '홍길동',
    bizNum: '111-22-33333',
    tel: '02-1234-5678',
  },
  memoItems: [],
  stamp: { on: false, style: 0, color: '#dc2626', posX: null, posY: null },
  extras: {
    date: { on: false, value: '' },
    bank: { on: false, value: '' },
    expiry: { on: false, value: '' },
    contact: { on: false, value: '' },
    payment: { on: false, value: '' },
  },
};

const STYLES = [
  { id: 'a', name: '모던 미니멀', tag: '스타트업 · 프리랜서' },
  { id: 'b', name: '클래식 비즈', tag: '기업 · 관공서' },
  { id: 'c', name: '에메랄드', tag: '에이전시 · 크리에이터' },
];

export default function Step2({ state, setDocStyle, onPrev, onNext }) {
  return (
    <div className="step active">
      <div className="snum">STEP 2 / 4</div>
      <div className="stitle">어떤 스타일로<br />만들까요?</div>
      <div className="sdesc">
        <span className="pc-only">클릭하면 오른쪽 미리보기가 바로 바뀌어요.</span>
        <span className="mo-only">마음에 드는 스타일을 골라보세요.</span>
      </div>
      <div className="scards three">
        {STYLES.map(s => (
          <div
            key={s.id}
            className={`scard${state.docStyle === s.id ? ' sel' : ''}`}
            onClick={() => setDocStyle(s.id)}
          >
            <div className="spbox">
              <div className="mini-doc-wrap">
                <DocTemplate state={{ ...DEMO_STATE, docStyle: s.id }} currentStep={99} />
              </div>
            </div>
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
