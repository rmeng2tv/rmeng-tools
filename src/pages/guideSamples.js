// 견적서 샘플 페이지(/guide)용 더미 데이터
// 같은 견적서 내용을 docStyle만 a/b/c로 바꿔 3벌 생성한다.
// DocTemplate에 그대로 넘기면 완성된 견적서가 렌더링된다.

const BASE_SAMPLE = {
  receiver: {
    type: 'business',
    name: '밝은미래 카페',
    ceo: '',
    person: '김도윤',
    bizNum: '',
    phone: '',
    address: '',
  },
  docStyle: 'a',
  quoteTitle: '매장 인테리어 공사',
  showSpec: false,
  items: [
    { id: 1, name: '벽면 도장 공사', spec: '', price: 850000, qty: 1 },
    { id: 2, name: '바닥 타일 시공', spec: '', price: 1200000, qty: 1 },
    { id: 3, name: '조명 설치 (LED)', spec: '', price: 450000, qty: 1 },
    { id: 4, name: '간판 제작·설치', spec: '', price: 680000, qty: 1 },
  ],
  taxMode: 'normal',
  sender: {
    name: '한빛 인테리어',
    ceo: '이정훈',
    bizNum: '123-45-67890',
    tel: '010-1234-5678',
    address: '서울시 마포구 월드컵로 12',
  },
  memoItems: [
    { id: 1, text: '부가세 별도 (세금계산서 발행 가능)', on: true },
    { id: 2, text: '계약금 50%, 잔금 50% 조건', on: true },
  ],
  stamp: { on: false, style: 0, color: '#dc2626', posX: null, posY: null },
  extras: {
    date: { on: false, value: '' },
    bank: { on: true, value: '국민은행 123456-78-901234 (한빛인테리어)' },
    expiry: { on: true, value: '견적일로부터 30일' },
    payment: { on: false, value: '' },
  },
};

// 스타일별 3벌 — docStyle만 교체
export const GUIDE_SAMPLES = [
  {
    style: 'a',
    label: '모던 미니멀',
    desc: '인디고 포인트의 깔끔한 디자인',
    state: { ...BASE_SAMPLE, docStyle: 'a' },
  },
  {
    style: 'b',
    label: '클래식 비즈',
    desc: '블랙 헤드의 정통 비즈니스 양식',
    state: { ...BASE_SAMPLE, docStyle: 'b' },
  },
  {
    style: 'c',
    label: '에메랄드',
    desc: '그린 톤의 산뜻한 분위기',
    state: { ...BASE_SAMPLE, docStyle: 'c' },
  },
];
