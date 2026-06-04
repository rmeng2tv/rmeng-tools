import { useRef, useState, useLayoutEffect } from 'react';
import { calcTax, calcItemTax } from '../utils/taxCalc';
import { fmtNumber } from '../utils/formatters';

// 날짜 변환 (YYYY-MM-DD → YYYY. MM. DD)
function formatDate(dateValue) {
  let d;
  if (dateValue && dateValue.includes('-')) {
    d = new Date(dateValue);
  } else {
    d = new Date();
  }
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;
}

// 일련번호
function generateDocNum() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `QQ-${code.slice(0, 3)}${code.slice(3)}`;
}
const docNum = generateDocNum();

// ── 페이지 분할 — 픽셀 실측 기반 ──
// A4 카드 안쪽 높이 (.sa는 height:1123, padding 56 상하 → 1011)
const PAGE_INNER_H = 1011;
// 하단 안전 여백: 빡빡하면 다음 페이지로. 단 빈 공간 많이 남으면 끼워 넣기.
const SAFETY_MARGIN = 24;
const USABLE_H = PAGE_INNER_H - SAFETY_MARGIN;

// 측정 영역에서 각 마커의 누적 높이를 측정
// 두 인접 마커의 offsetTop 차이 = 그 영역의 점유 높이 (margin 자동 포함)
function measureBlocks(root) {
  if (!root) return null;
  const m = (sel) => root.querySelector(`[data-mh="${sel}"]`);
  const head = m('head');
  const parties = m('parties');
  const tblHead = m('tblhead');
  const total = m('total');
  const memo = m('memo');
  const extras = m('extras');
  const footer = m('footer');
  const tail = m('tail'); // 끝 마커 (마지막 영역 높이 측정용)

  if (!head || !tblHead || !tail) return null;

  const headH = (parties ? parties.offsetTop : tblHead.offsetTop) - head.offsetTop;
  const partiesH = parties ? (tblHead.offsetTop - parties.offsetTop) : 0;

  const rowEls = [...root.querySelectorAll('[data-mh="row"]')];
  const firstRow = rowEls[0];
  const tblHeadH = (firstRow?.offsetTop ?? total?.offsetTop ?? footer?.offsetTop ?? tail.offsetTop) - tblHead.offsetTop;

  const rowHs = rowEls.map((el, i) => {
    const next = rowEls[i + 1] ?? total ?? memo ?? extras ?? footer ?? tail;
    return next.offsetTop - el.offsetTop;
  });

  const totalH = total
    ? (memo?.offsetTop ?? extras?.offsetTop ?? footer?.offsetTop ?? tail.offsetTop) - total.offsetTop
    : 0;
  const memoH = memo
    ? (extras?.offsetTop ?? footer?.offsetTop ?? tail.offsetTop) - memo.offsetTop
    : 0;
  const extrasH = extras
    ? (footer?.offsetTop ?? tail.offsetTop) - extras.offsetTop
    : 0;
  const footerH = footer ? tail.offsetTop - footer.offsetTop : 0;

  return { headH, partiesH, tblHeadH, rowHs, totalH, memoH, extrasH, footerH };
}

// 측정 결과로 페이지 메타 배열 생성
// 블록(품목행 / 합계 / 특이사항 / 추가정보 / 푸터)을 위에서부터 한 덩어리씩
// "이 페이지에 들어가?" 검사하며 흘려보냄. 빈 공간을 최대한 채우고
// 안 들어가는 블록만 다음 페이지로 내림.
function splitToPages(meas, itemList) {
  if (!meas) return null;
  const { headH, partiesH, tblHeadH, rowHs, totalH, memoH, extrasH, footerH } = meas;

  // 빈 케이스 — 1페이지에 다 들어감
  if (rowHs.length === 0) {
    return [{
      items: [], showReceiver: true, showTblHead: true,
      showTotal: true, showMemo: true, showExtras: true,
      showFooter: true, isLast: true,
    }];
  }

  const newPage = (opts) => ({
    items: [], showReceiver: false, showTblHead: false,
    showTotal: false, showMemo: false, showExtras: false,
    showFooter: false, isLast: false, ...opts,
  });

  const pages = [];
  // 1페이지: 수신/발신 + 표 머리글 포함
  let cur = newPage({ showReceiver: true, showTblHead: true });
  let used = headH + partiesH + tblHeadH;

  // 1. 품목 행 배치
  for (let i = 0; i < itemList.length; i++) {
    const rowH = rowHs[i] ?? 50;
    if (used + rowH > USABLE_H && cur.items.length > 0) {
      pages.push(cur);
      // 이어지는 품목 페이지: 표 머리글만 (수신/발신 없음)
      cur = newPage({ showTblHead: true });
      used = tblHeadH;
    }
    cur.items.push(itemList[i]);
    used += rowH;
  }

  // 2~5. 꼬리 블록을 한 덩어리씩 배치.
  // 다음 페이지로 넘어가면 품목 행이 없으므로 표 머리글도 숨김.
  const placeBlock = (h, flag) => {
    if (used + h > USABLE_H) {
      pages.push(cur);
      cur = newPage({}); // 품목/머리글/수신·발신 모두 없음
      used = 0;
    }
    cur[flag] = true;
    used += h;
  };

  placeBlock(totalH, 'showTotal');           // 2. 합계
  if (memoH > 0) placeBlock(memoH, 'showMemo');     // 3. 특이사항
  if (extrasH > 0) placeBlock(extrasH, 'showExtras'); // 4. 추가정보 (블록 통째)
  placeBlock(footerH, 'showFooter');         // 5. 푸터

  cur.isLast = true;
  pages.push(cur);

  return pages;
}

export default function DocTemplate({ state, currentStep }) {
  const { receiver, docStyle, quoteTitle, showSpec, items, taxMode, sender, memoItems, extras } = state;
  const { supply, vat, total, vatLabel } = calcTax(items, taxMode);

  const dateStr = (extras.date?.on && extras.date?.value) ? formatDate(extras.date.value) : formatDate();
  const blurred = currentStep < 3;
  const filledItems = items.filter(i => i.name || i.price);
  const activeMemos = memoItems.filter(m => m.on);

  // 픽셀 실측 → 페이지 분할 (스타일 A 전용 — B/C는 다음 단계에서 동일 패턴 적용)
  const measureRefA = useRef(null);
  const [pagesA, setPagesA] = useState(null);
  useLayoutEffect(() => {
    if (docStyle !== 'a') return;
    const meas = measureBlocks(measureRefA.current);
    setPagesA(splitToPages(meas, filledItems));
    // state, currentStep 변경 시 자동 재측정 — 의존성 배열에 state 통째로
  }, [state, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // 수신자 / 발신자 표기 데이터
  const isBiz = receiver.type === 'business';
  const receiverName = receiver.name || '—';
  const receiverHonor = isBiz ? '귀중' : '님 귀하';
  const receiverNameLine = `${receiverName} ${receiverHonor}`;

  // 수신자 info 라인 배열
  const receiverInfoLines = [];
  if (isBiz && receiver.ceo) receiverInfoLines.push(`대표자 : ${receiver.ceo}`);
  if (isBiz && receiver.person) receiverInfoLines.push(`담당자 : ${receiver.person}`);
  if (isBiz && receiver.bizNum) receiverInfoLines.push(`사업자등록번호 : ${receiver.bizNum}`);
  if (receiver.phone) receiverInfoLines.push(`전화 : ${receiver.phone}`);
  if (receiver.address) receiverInfoLines.push(`주소 : ${receiver.address}`);

  // 발신자 info 라인
  const senderName = sender.name || '—';
  const senderInfoLines = [];
  if (sender.ceo) senderInfoLines.push(`대표자 : ${sender.ceo}`);
  if (sender.bizNum) senderInfoLines.push(`사업자등록번호 : ${sender.bizNum}`);
  if (sender.address) senderInfoLines.push(`주소 : ${sender.address}`);

  // 추가 제안
  const extraMap = {
    bank: '입금 계좌',
    expiry: '견적 유효기간',
    payment: '결제 조건',
  };
  const activeExtras = Object.entries(extras).filter(([key, v]) => v.on && key !== 'date');

  // hidden 모드 여부
  const isHidden = taxMode === 'hidden';

  // 컬럼 수: 품목 + [규격] + 수량 + 단가 + [공급가액] + (세액 or 금액)
  const colSpan = (showSpec ? 1 : 0) + (isHidden ? 4 : 5);

  // 테이블 헤더 (CRM 순서: 품목 / 규격 / 수량 / 단가 / 공급가액 / 세액)
  const renderTblHead = () => (
    <thead>
      <tr>
        <th>품목</th>
        {showSpec && <th>규격</th>}
        <th className="r">수량</th>
        <th className="r">단가</th>
        {!isHidden && <th className="r">공급가액</th>}
        <th className="r">{isHidden ? '금액' : '세액'}</th>
      </tr>
    </thead>
  );

  // 품목 행 — 전체 품목 0개일 때만 안내 메시지, 그 외엔 페이지에 할당된 행만 렌더
  const renderTblRows = (pageItems) => {
    if (filledItems.length === 0) {
      return (
        <tr>
          <td colSpan={colSpan} className="d-empty">품목을 입력하면 여기에 표시돼요</td>
        </tr>
      );
    }
    return pageItems.map(item => {
      const { supply: itemSupply, tax: itemTax } = calcItemTax(item, taxMode);
      return (
        <tr key={item.id} data-mh="row">
          <td>{item.name || '—'}</td>
          {showSpec && <td className="d-spec">{item.spec || '—'}</td>}
          <td className="r">{item.qty}</td>
          <td className="r">{item.price ? fmtNumber(item.price) : '—'}</td>
          {!isHidden && (
            <td className="r">{item.price ? fmtNumber(itemSupply) : '—'}</td>
          )}
          <td className="r">
            {isHidden
              ? (item.price ? fmtNumber(itemSupply) : '—')
              : (itemTax ? fmtNumber(itemTax) : '0')}
          </td>
        </tr>
      );
    });
  };

  // 합계 — hidden 모드에선 공급가액/부가세 행 숨기고 "금액" 한 줄만
  const totalBlock = (prefix) => (
    <div className={`${prefix}-total`}>
      {!isHidden && (
        <>
          <div className={`${prefix}-total-row`}>
            <span>공급가액</span>
            <span>{fmtNumber(supply)}원</span>
          </div>
          <div className={`${prefix}-total-row`}>
            <span>{vatLabel}</span>
            <span>{fmtNumber(vat)}원</span>
          </div>
        </>
      )}
      <div className={`${prefix}-total-row fin`}>
        <span>{isHidden ? '금 액' : '합 계'}</span>
        <span>{fmtNumber(total)}원</span>
      </div>
    </div>
  );

  // ── 수신/발신 (CRM 클래스 구조) ──
  // Style A: party / party-role / party-name / party-info
  // Style B: party / role / name / info
  // Style C: party / role / name / info  (+ 'send' modifier on sender)
  const renderParty = (prefix, kind) => {
    const isSend = kind === 'send';
    const name = isSend ? senderName : receiverNameLine;
    const infoLines = isSend ? senderInfoLines : receiverInfoLines;
    const role = isSend ? '발 신' : '수 신';

    // Style A 클래스 네이밍: party-role / party-name / party-info
    if (prefix === 'sa') {
      return (
        <div className={`sa-party${isSend ? ' send' : ' receive'}`}>
          <div className="sa-party-role">{role}</div>
          <div className="sa-party-name">{name}</div>
          {infoLines.length > 0 && (
            <div className="sa-party-info">
              {infoLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      );
    }

    // Style B/C 클래스 네이밍: role / name / info
    return (
      <div className={`${prefix}-party${isSend ? ' send' : ' receive'}`}>
        <div className={`${prefix}-role`}>{role}</div>
        <div className={`${prefix}-name`}>{name}</div>
        {infoLines.length > 0 && (
          <div className={`${prefix}-info`}>
            {infoLines.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}
      </div>
    );
  };

  const partiesBlock = (prefix) => (
    <div className={`${prefix}-parties`}>
      {renderParty(prefix, 'receive')}
      {renderParty(prefix, 'send')}
    </div>
  );

  // ── 특이사항 (CRM 구조: head + body) ──
  const memoBlock = (prefix) => activeMemos.length > 0 && (
    <div className={`${prefix}-memo`} data-break="memo">
      <div className={`${prefix}-memo-head`}>
        <span className={`${prefix}-memo-title`}>특이사항</span>
        <span className={`${prefix}-memo-cont`}>{activeMemos.length}건</span>
      </div>
      <div className={`${prefix}-memo-body`}>
        {activeMemos.map(m => (
          <div className={`${prefix}-memo-item`} data-break="memo-item" key={m.id}>
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );

  // 추가 제안 섹션
  const extrasBlock = (prefix) => activeExtras.length > 0 && (
    <div className={`${prefix}-extras`}>
      {activeExtras.map(([key, val]) => (
        <div className={`${prefix}-extra-box`} data-break="extra" key={key}>
          <div className={`${prefix}-extra-label`}>{extraMap[key]}</div>
          <div className={`${prefix}-extra-val`}>{val.value || '입력 중...'}</div>
        </div>
      ))}
    </div>
  );

  // 푸터
  const footerBlock = (prefix) => (
    <div className={`${prefix}-footer`}>
      <div className={`${prefix}-footer-name`}>{senderName}</div>
      {sender.tel && <div className={`${prefix}-footer-tel`}>{sender.tel}</div>}
    </div>
  );

  // ── 스타일 A: 모던 미니멀 (인디고) — 픽셀 실측 기반 페이지 분할 ──
  if (docStyle === 'a') {
    const renderSaHead = () => (
      <>
        <div className="sa-head">
          <div className="sa-head-left">
            <div className="sa-eyebrow">QUOTATION</div>
            <div className="sa-title">견 적 서</div>
            {quoteTitle && <div className="sa-subtitle">{quoteTitle}</div>}
          </div>
          <div className="sa-head-right">
            {sender.tel && <div className="sa-tel">{sender.tel}</div>}
            <div className="sa-date">발행일 : {dateStr}</div>
          </div>
        </div>
        <div className="sa-divider" />
      </>
    );

    // 측정 영역: 한 덩어리로 모든 콘텐츠 그려서 픽셀 실측
    // 분할 결과와 같은 컴포넌트/CSS 사용 → 측정값 정확
    const measureLayer = (
      <div ref={measureRefA} style={{
        position: 'absolute', left: -9999, top: 0,
        width: 794, visibility: 'hidden', pointerEvents: 'none',
      }}>
        <div className="sa" style={{ height: 'auto', display: 'block' }}>
          <div data-mh="head">{renderSaHead()}</div>
          <div data-mh="parties">{partiesBlock('sa')}</div>
          <div className="d-bwrap clear">
            <table className="sa-tbl">
              <thead data-mh="tblhead">
                <tr>
                  <th>품목</th>
                  {showSpec && <th>규격</th>}
                  <th className="r">수량</th>
                  <th className="r">단가</th>
                  {!isHidden && <th className="r">공급가액</th>}
                  <th className="r">{isHidden ? '금액' : '세액'}</th>
                </tr>
              </thead>
              <tbody>{renderTblRows(filledItems)}</tbody>
            </table>
            <div data-mh="total"><div className="sa-total-wrap">{totalBlock('sa')}</div></div>
            {activeMemos.length > 0 && <div data-mh="memo">{memoBlock('sa')}</div>}
            {activeExtras.length > 0 && <div data-mh="extras">{extrasBlock('sa')}</div>}
          </div>
          <div data-mh="footer">{footerBlock('sa')}</div>
          <div data-mh="tail" style={{ height: 0 }} />
        </div>
      </div>
    );

    return (
      <>
        {measureLayer}
        {pagesA && pagesA.map((page, pIdx) => (
          <div className="sa" key={pIdx}>
            {page.showReceiver && (
              <>
                {renderSaHead()}
                {partiesBlock('sa')}
              </>
            )}
            <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
              {page.showTblHead && (
                <table className="sa-tbl">
                  {renderTblHead()}
                  <tbody>{renderTblRows(page.items)}</tbody>
                </table>
              )}
              {page.showTotal && (
                <div className="sa-total-wrap">{totalBlock('sa')}</div>
              )}
              {page.showMemo && memoBlock('sa')}
              {page.showExtras && extrasBlock('sa')}
            </div>
            <div className="sa-spacer" />
            {page.showFooter && footerBlock('sa')}
            {pagesA.length > 1 && (
              <div className="sa-pageno">{pIdx + 1} / {pagesA.length}</div>
            )}
          </div>
        ))}
      </>
    );
  }

  // ── 스타일 B: 클래식 비즈 (블랙) ──
  if (docStyle === 'b') {
    return (
      <div className="sb">
        <div className="sb-topbar" />
        <div className="sb-inner">
          <div className="sb-head">
            <div className="sb-head-left">
              <div className="sb-title">견 적 서</div>
              <div className="sb-subtitle">{quoteTitle || 'Quotation'}</div>
            </div>
            <div className="sb-head-right">
              {sender.tel && <div className="sb-tel">{sender.tel}</div>}
              <div className="sb-date">발행일 : {dateStr}</div>
            </div>
          </div>
          {partiesBlock('sb')}
          <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
            <table className="sb-tbl">
              {renderTblHead()}
              <tbody>{renderTblRows(filledItems)}</tbody>
            </table>
            <div className="sb-total-wrap">{totalBlock('sb')}</div>
            {memoBlock('sb')}
            {extrasBlock('sb')}
          </div>
          <div className="sb-spacer" />
          {footerBlock('sb')}
        </div>
      </div>
    );
  }

  // ── 스타일 C: 에메랄드 ──
  return (
    <div className="sc">
      <div className="sc-head">
        <div className="sc-head-left">
          <div className="sc-eyebrow">QUOTATION DOCUMENT</div>
          <div className="sc-title">견 적 서</div>
          {quoteTitle && <div className="sc-subtitle">{quoteTitle}</div>}
        </div>
        <div className="sc-head-right">
          {sender.tel && <div className="sc-tel">{sender.tel}</div>}
          <div className="sc-date">발행일 : {dateStr}</div>
        </div>
      </div>
      <div className="sc-divider" />
      {partiesBlock('sc')}
      <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
        <table className="sc-tbl">
          {renderTblHead()}
          <tbody>{renderTblRows(filledItems)}</tbody>
        </table>
        <div className="sc-total-wrap">{totalBlock('sc')}</div>
        {memoBlock('sc')}
        {extrasBlock('sc')}
      </div>
      <div className="sc-spacer" />
      {footerBlock('sc')}
    </div>
  );
}
