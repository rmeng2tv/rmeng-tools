import { useState, useCallback, useEffect } from 'react';

// ── localStorage 헬퍼 ──
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── 기본 메모 프리셋 ──
const MEMO_VERSION = 2; // 프리셋 변경 시 버전 올리면 자동 갱신
const DEFAULT_MEMOS = [
  { id: 1, text: '부가세 별도 (세금계산서 발행 가능)', on: false },
  { id: 2, text: '계약금 50%, 잔금 50% 조건', on: false },
  { id: 3, text: '작업 완료 후 세금계산서 발행', on: false },
  { id: 4, text: '재료비 변동 시 금액 조정 가능', on: false },
  { id: 5, text: '방문 일정 협의 후 진행', on: false },
  { id: 6, text: '샘플 확인 후 최종 견적 확정', on: false },
  { id: 7, text: '무통장 입금 후 작업 시작', on: false },
];

function loadMemos() {
  const savedVersion = loadJSON('qt_memos_v', 0);
  if (savedVersion < MEMO_VERSION) {
    saveJSON('qt_memos_v', MEMO_VERSION);
    saveJSON('qt_memos', DEFAULT_MEMOS);
    return DEFAULT_MEMOS;
  }
  return loadJSON('qt_memos', DEFAULT_MEMOS);
}

const DEFAULT_STAMP = {
  on: false,
  style: 0,
  color: '#dc2626',
  posX: null,
  posY: null,
};

const DEFAULT_SENDER = {
  name: '',
  ceo: '',
  bizNum: '',
  tel: '',
};

// ── 초기 상태 생성 (localStorage 반영) ──
function createInitialState() {
  return {
    receiver: {
      type: 'business',  // 'business' | 'individual'
      name: '',
      ceo: '',
      person: '',
      bizNum: '',
      phone: '',
      address: '',
    },
    docStyle: 'a',
    quoteTitle: '',
    showSpec: false,
    items: [{ id: 1, name: '', spec: '', price: 0, qty: 1 }],
    taxMode: 'normal',
    sender: loadJSON('qt_sender', DEFAULT_SENDER),
    memoItems: loadMemos(),
    stamp: loadJSON('qt_stamp', DEFAULT_STAMP),
    extras: {
      date: { on: false, value: '' },
      bank: { on: false, value: '' },
      expiry: { on: false, value: '' },
      contact: { on: false, value: '' },
      payment: { on: false, value: '' },
    },
  };
}

// ── Hook ──
export default function useQuote() {
  const [state, setState] = useState(createInitialState);
  const [nextItemId, setNextItemId] = useState(2);
  const [nextMemoId, setNextMemoId] = useState(100);

  // localStorage 자동 저장 (sender, memoItems, stamp 변경 시)
  useEffect(() => { saveJSON('qt_sender', state.sender); }, [state.sender]);
  useEffect(() => { saveJSON('qt_memos', state.memoItems); }, [state.memoItems]);
  useEffect(() => { saveJSON('qt_stamp', state.stamp); }, [state.stamp]);

  // ── 수신자 ──
  const updateReceiver = useCallback((field, value) => {
    setState(prev => ({
      ...prev,
      receiver: { ...prev.receiver, [field]: value },
    }));
  }, []);

  // ── 스타일 ──
  const setDocStyle = useCallback((style) => {
    setState(prev => ({ ...prev, docStyle: style }));
  }, []);

  // ── 견적 제목 ──
  const setQuoteTitle = useCallback((title) => {
    setState(prev => ({ ...prev, quoteTitle: title }));
  }, []);

  // ── 규격 컬럼 토글 ──
  const toggleShowSpec = useCallback(() => {
    setState(prev => ({ ...prev, showSpec: !prev.showSpec }));
  }, []);

  // ── 품목 ──
  const addItem = useCallback(() => {
    setNextItemId(prev => prev + 1);
    setState(prev => ({
      ...prev,
      items: [...prev.items, { id: nextItemId, name: '', spec: '', price: 0, qty: 1 }],
    }));
  }, [nextItemId]);

  const updateItem = useCallback((id, field, value) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const deleteItem = useCallback((id) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  // ── 세금 ──
  const setTaxMode = useCallback((mode) => {
    setState(prev => ({ ...prev, taxMode: mode }));
  }, []);

  // ── 발신자 ──
  const updateSender = useCallback((field, value) => {
    setState(prev => ({
      ...prev,
      sender: { ...prev.sender, [field]: value },
    }));
  }, []);

  // ── 메모 ──
  const toggleMemo = useCallback((id) => {
    setState(prev => ({
      ...prev,
      memoItems: prev.memoItems.map(m =>
        m.id === id ? { ...m, on: !m.on } : m
      ),
    }));
  }, []);

  const editMemo = useCallback((id, text) => {
    setState(prev => ({
      ...prev,
      memoItems: prev.memoItems.map(m =>
        m.id === id ? { ...m, text } : m
      ),
    }));
  }, []);

  const deleteMemo = useCallback((id) => {
    setState(prev => ({
      ...prev,
      memoItems: prev.memoItems.filter(m => m.id !== id),
    }));
  }, []);

  const moveMemo = useCallback((id, dir) => {
    setState(prev => {
      const list = [...prev.memoItems];
      const idx = list.findIndex(m => m.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= list.length) return prev;
      [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      return { ...prev, memoItems: list };
    });
  }, []);

  const addMemo = useCallback((text) => {
    if (!text.trim()) return;
    setNextMemoId(prev => prev + 1);
    setState(prev => ({
      ...prev,
      memoItems: [...prev.memoItems, { id: nextMemoId, text: text.trim(), on: true }],
    }));
  }, [nextMemoId]);

  const restoreDefaultMemos = useCallback(() => {
    setState(prev => {
      const existingTexts = prev.memoItems.map(m => m.text);
      const missing = DEFAULT_MEMOS.filter(d => !existingTexts.includes(d.text));
      if (missing.length === 0) return prev;
      const restored = missing.map((m, i) => ({ ...m, id: nextMemoId + i, on: false }));
      setNextMemoId(prev2 => prev2 + missing.length);
      return { ...prev, memoItems: [...prev.memoItems, ...restored] };
    });
  }, [nextMemoId]);

  // ── 도장 ──
  const updateStamp = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      stamp: { ...prev.stamp, ...updates },
    }));
  }, []);

  // ── 추가 제안 ──
  const toggleExtra = useCallback((key) => {
    setState(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [key]: { ...prev.extras[key], on: !prev.extras[key].on },
      },
    }));
  }, []);

  const updateExtra = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [key]: { ...prev.extras[key], value },
      },
    }));
  }, []);

  // ── 전체 리셋 ──
  const resetAll = useCallback(() => {
    setState({
      ...createInitialState(),
      sender: state.sender,
      memoItems: state.memoItems,
      stamp: state.stamp,
    });
  }, [state.sender, state.memoItems, state.stamp]);

  return {
    state,
    updateReceiver,
    setDocStyle,
    setQuoteTitle,
    toggleShowSpec,
    addItem,
    updateItem,
    deleteItem,
    setTaxMode,
    updateSender,
    toggleMemo,
    editMemo,
    deleteMemo,
    moveMemo,
    addMemo,
    updateStamp,
    restoreDefaultMemos,
    toggleExtra,
    updateExtra,
    resetAll,
  };
}
