import { calcTax } from '../utils/taxCalc';
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

export default function DocTemplate({ state, currentStep }) {
  const { receiver, docStyle, quoteTitle, showSpec, items, taxMode, sender, memoItems, extras } = state;
  const { supply, vat, total, vatLabel } = calcTax(items, taxMode);

  const dateStr = (extras.date?.on && extras.date?.value) ? formatDate(extras.date.value) : formatDate();
  const blurred = currentStep < 3;
  const filledItems = items.filter(i => i.name || i.price);
  const activeMemos = memoItems.filter(m => m.on);

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

  // 추가 제안
  const extraMap = {
    bank: '입금 계좌',
    expiry: '견적 유효기간',
    contact: '담당자 연락처',
    payment: '결제 조건',
  };
  const activeExtras = Object.entries(extras).filter(([key, v]) => v.on && key !== 'date');

  // 컬럼 수
  const colSpan = showSpec ? 5 : 4;

  // 테이블 헤더 (CRM 순서: 품목 / 규격 / 수량 / 단가 / 금액)
  const tblHead = (
    <thead>
      <tr>
        <th>품목</th>
        {showSpec && <th>규격</th>}
        <th className="r">수량</th>
        <th className="r">단가</th>
        <th className="r">금액</th>
      </tr>
    </thead>
  );

  // 품목 행
  const tblRows = filledItems.length === 0 ? (
    <tr>
      <td colSpan={colSpan} className="d-empty">품목을 입력하면 여기에 표시돼요</td>
    </tr>
  ) : (
    filledItems.map(item => (
      <tr key={item.id}>
        <td>{item.name || '—'}</td>
        {showSpec && <td className="d-spec">{item.spec || '—'}</td>}
        <td className="r">{item.qty}</td>
        <td className="r">{item.price ? fmtNumber(item.price) : '—'}</td>
        <td className="r">{item.price ? fmtNumber(item.price * item.qty) : '—'}</td>
      </tr>
    ))
  );

  // 합계
  const totalBlock = (prefix) => (
    <div className={`${prefix}-total`}>
      <div className={`${prefix}-total-row`}>
        <span>공급가액</span>
        <span>{fmtNumber(supply)}원</span>
      </div>
      <div className={`${prefix}-total-row`}>
        <span>{vatLabel}</span>
        <span>{fmtNumber(vat)}원</span>
      </div>
      <div className={`${prefix}-total-row fin`}>
        <span>합 계</span>
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

  // ── 스타일 A: 모던 미니멀 (인디고) ──
  if (docStyle === 'a') {
    return (
      <div className="sa">
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
        {partiesBlock('sa')}
        <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
          <table className="sa-tbl">
            {tblHead}
            <tbody>{tblRows}</tbody>
          </table>
          <div className="sa-total-wrap">{totalBlock('sa')}</div>
          {memoBlock('sa')}
          {extrasBlock('sa')}
        </div>
        <div className="sa-spacer" />
        {footerBlock('sa')}
      </div>
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
              {tblHead}
              <tbody>{tblRows}</tbody>
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
          {tblHead}
          <tbody>{tblRows}</tbody>
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
