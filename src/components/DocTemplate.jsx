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

  // 수신자 데이터 (개인/사업자별)
  const isBiz = receiver.type === 'business';
  const receiverName = receiver.name || '—';

  // 발신자 데이터
  const senderName = sender.name || '—';

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

  // 테이블 헤더 (CRM 순서: 품목/규격/수량/단가/금액)
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

  // 수신자 메타 블록 (스타일 prefix만 다름)
  const receiverBlock = (prefix) => (
    <div className={`${prefix}-mc`}>
      <div className={`${prefix}-ml`}>수 신</div>
      <div className={`${prefix}-mv`}>
        {isBiz ? `${receiverName} 귀중` : `${receiverName} 님 귀하`}
      </div>
      {isBiz && receiver.ceo && <div className={`${prefix}-msub`}>대표자 : {receiver.ceo}</div>}
      {isBiz && receiver.person && <div className={`${prefix}-msub`}>담당자 : {receiver.person}</div>}
      {isBiz && receiver.bizNum && <div className={`${prefix}-msub`}>사업자등록번호 : {receiver.bizNum}</div>}
      {receiver.phone && <div className={`${prefix}-msub`}>전화 : {receiver.phone}</div>}
      {receiver.address && <div className={`${prefix}-msub`}>주소 : {receiver.address}</div>}
    </div>
  );

  const senderBlock = (prefix) => (
    <div className={`${prefix}-mc`}>
      <div className={`${prefix}-ml`}>발 신</div>
      <div className={`${prefix}-mv`}>{senderName}</div>
      {sender.ceo && <div className={`${prefix}-msub`}>대표자 : {sender.ceo}</div>}
      {sender.bizNum && <div className={`${prefix}-msub`}>사업자등록번호 : {sender.bizNum}</div>}
    </div>
  );

  // 합계 박스
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

  // 메모 섹션
  const memoBlock = (prefix) => activeMemos.length > 0 && (
    <div className={`${prefix}-memo`} data-break="memo">
      <div className={`${prefix}-memo-header`}>
        <span>특이사항</span>
        <span className={`${prefix}-memo-count`}>{activeMemos.length}건</span>
      </div>
      <ul className={`${prefix}-memo-list`}>
        {activeMemos.map(m => (
          <li key={m.id} data-break="memo-item">{m.text}</li>
        ))}
      </ul>
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
      <div className={`${prefix}-footer-left`}>
        <div className={`${prefix}-footer-name`}>{senderName}</div>
        {sender.tel && <div className={`${prefix}-footer-tel`}>{sender.tel}</div>}
      </div>
    </div>
  );

  // ── 스타일 A: 모던 미니멀 (인디고 #4f46e5) ──
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
        <div className="sa-meta">
          {receiverBlock('sa')}
          {senderBlock('sa')}
        </div>
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

  // ── 스타일 B: 클래식 비즈 (블랙 #111) ──
  if (docStyle === 'b') {
    return (
      <div className="sb">
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
        <div className="sb-divider" />
        <div className="sb-meta">
          {receiverBlock('sb')}
          {senderBlock('sb')}
        </div>
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
    );
  }

  // ── 스타일 C: 에메랄드 (#059669) ──
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
      <div className="sc-meta">
        {receiverBlock('sc')}
        {senderBlock('sc')}
      </div>
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
