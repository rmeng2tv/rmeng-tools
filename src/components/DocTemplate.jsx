import { calcTax } from '../utils/taxCalc';
import { fmtNumber } from '../utils/formatters';

const MID = ' · ';

// 날짜 문자열 변환 (YYYY-MM-DD → YYYY.MM.DD)
function formatDate(dateValue) {
  if (dateValue && dateValue.includes('-')) {
    return dateValue.replace(/-/g, '.');
  }
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}

// 일련번호 (세션당 1회 생성)
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

  // 발신자 부가 라인
  const senderLine2 = sender.ceo ? sender.ceo + ' 대표' : '';
  const senderLine3 = [sender.bizNum, sender.tel].filter(Boolean).join(MID);

  // ── 수신자 표시 분기 (개인/사업자) ──
  const isBiz = receiver.type === 'business';
  const receiverName = receiver.name || '—';
  const receiverHonor = isBiz ? '귀중' : '님 귀하';
  const receiverNameLine = `${receiverName} ${receiverHonor}`;
  const bizPersonLine = isBiz ? [
    receiver.ceo ? `대표 ${receiver.ceo}` : '',
    receiver.person ? `담당 ${receiver.person} 귀하` : '',
  ].filter(Boolean).join(MID) : '';
  const bizNumLine = (isBiz && receiver.bizNum) ? `사업자등록번호 ${receiver.bizNum}` : '';
  const receiverContactLine = [receiver.phone, receiver.address].filter(Boolean).join(MID);

  const extraMap = {
    bank: '입금 계좌',
    expiry: '견적 유효기간',
    contact: '담당자 연락처',
    payment: '결제 조건',
  };
  const activeExtras = Object.entries(extras).filter(([key, v]) => v.on && key !== 'date');

  // 품목 컬럼 수
  const colSpan = showSpec ? 5 : 4;

  // 품목 행
  const itemRows = filledItems.length === 0 ? (
    <tr>
      <td colSpan={colSpan} className="d-empty">품목을 입력하면 여기에 표시돼요</td>
    </tr>
  ) : (
    filledItems.map(item => (
      <tr key={item.id}>
        <td>{item.name || '—'}</td>
        {showSpec && <td className="d-spec">{item.spec || '—'}</td>}
        <td className="r">{item.price ? fmtNumber(item.price) + '원' : '—'}</td>
        <td className="r">{item.qty}</td>
        <td className="r">{item.price ? fmtNumber(item.price * item.qty) + '원' : '—'}</td>
      </tr>
    ))
  );

  // 테이블 헤더
  const tblHead = (
    <thead>
      <tr>
        <th>품목명</th>
        {showSpec && <th>규격</th>}
        <th className="r">단가</th>
        <th className="r">수량</th>
        <th className="r">금액</th>
      </tr>
    </thead>
  );

  // 메모 섹션
  const memoSection = activeMemos.length > 0 && (
    <div className="d-memo" data-break="memo">
      <div className="d-memo-title">특이사항</div>
      {activeMemos.map(m => (
        <div className="d-memo-item" data-break="memo-item" key={m.id}>{'•'} {m.text}</div>
      ))}
    </div>
  );

  // 추가 제안 섹션
  const extrasSection = activeExtras.length > 0 && (
    <div className="d-extras">
      {activeExtras.map(([key, val]) => (
        <div className="d-extra-box" data-break="extra" key={key}>
          <div className="d-extra-label">{extraMap[key]}</div>
          <div className="d-extra-val">{val.value || '입력 중...'}</div>
        </div>
      ))}
    </div>
  );

  // 수신자/발신자 메타 (스타일별 prefix만 다름)
  const receiverMeta = (prefix) => (
    <div className={`${prefix}-mc`}>
      <span className={`${prefix}-ml`}>수신</span>
      <span className={`${prefix}-mv`}>{receiverNameLine}</span>
      {bizPersonLine && <span className={`${prefix}-msub`}>{bizPersonLine}</span>}
      {bizNumLine && <span className={`${prefix}-msub`}>{bizNumLine}</span>}
      {receiverContactLine && <span className={`${prefix}-msub`}>{receiverContactLine}</span>}
    </div>
  );

  const senderMeta = (prefix) => (
    <div className={`${prefix}-mc`} style={{ textAlign: 'right' }}>
      <span className={`${prefix}-ml`}>발신</span>
      <span className={`${prefix}-mv`}>{sender.name || '—'}</span>
      {senderLine2 && <span className={`${prefix}-msub`}>{senderLine2}</span>}
      {senderLine3 && <span className={`${prefix}-msub`}>{senderLine3}</span>}
    </div>
  );

  // ── 스타일 A: 모던 미니멀 (인디고) ──
  if (docStyle === 'a') {
    return (
      <div className="sa">
        <div className="sa-topbar" />
        <div className="sa-toprow">
          <div>
            <div className="sa-title">견 적 서</div>
            {quoteTitle && <div className="sa-subtitle">{quoteTitle}</div>}
            <div className="sa-num">{docNum}</div>
          </div>
          <div className="sa-date">{dateStr}</div>
        </div>
        <div className="sa-meta">
          {receiverMeta('sa')}
          {senderMeta('sa')}
        </div>
        <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
          <table className="sa-tbl">
            {tblHead}
            <tbody>{itemRows}</tbody>
          </table>
          <div className="sa-tot-wrap">
            <div className="sa-tot">
              <div className="sa-tr"><span>공급가액</span><span>{fmtNumber(supply)}원</span></div>
              <div className="sa-tr"><span>{vatLabel}</span><span>{fmtNumber(vat)}원</span></div>
              <div className="sa-tr fin"><span>합계</span><span>{fmtNumber(total)}원</span></div>
            </div>
          </div>
          {memoSection}
          {extrasSection}
        </div>
        <div className="sa-footer" />
      </div>
    );
  }

  // ── 스타일 B: 클래식 비즈 (블랙) ──
  if (docStyle === 'b') {
    return (
      <div className="sb">
        <div className="sb-hblock">
          <div className="sb-title">견 적 서</div>
          {quoteTitle && <div className="sb-subtitle">{quoteTitle}</div>}
          <div className="sb-num">{docNum}</div>
        </div>
        <div className="sb-toprow">
          <div />
          <div className="sb-date">{dateStr}</div>
        </div>
        <div className="sb-meta">
          {receiverMeta('sb')}
          {senderMeta('sb')}
        </div>
        <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
          <table className="sb-tbl">
            {tblHead}
            <tbody>{itemRows}</tbody>
          </table>
          <div className="sb-tot-wrap">
            <div className="sb-tot">
              <div className="sb-tr"><span>공급가액</span><span>{fmtNumber(supply)}원</span></div>
              <div className="sb-tr"><span>{vatLabel}</span><span>{fmtNumber(vat)}원</span></div>
              <div className="sb-tr fin"><span>합계</span><span>{fmtNumber(total)}원</span></div>
            </div>
          </div>
          {memoSection}
          {extrasSection}
        </div>
        <div className="sb-footer" />
      </div>
    );
  }

  // ── 스타일 C: 에메랄드 ──
  return (
    <div className="sc">
      <div className="sc-eyebrow">QUOTATION</div>
      <div className="sc-toprow">
        <div>
          <div className="sc-title">견 적 서</div>
          {quoteTitle && <div className="sc-subtitle">{quoteTitle}</div>}
          <div className="sc-num">{docNum}</div>
        </div>
        <div className="sc-date">{dateStr}</div>
      </div>
      <div className="sc-meta">
        {receiverMeta('sc')}
        {senderMeta('sc')}
      </div>
      <div className={`d-bwrap${blurred ? ' blurred' : ' clear'}`}>
        <table className="sc-tbl">
          {tblHead}
          <tbody>{itemRows}</tbody>
        </table>
        <div className="sc-tot-wrap">
          <div className="sc-tot">
            <div className="sc-tr"><span>공급가액</span><span>{fmtNumber(supply)}원</span></div>
            <div className="sc-tr"><span>{vatLabel}</span><span>{fmtNumber(vat)}원</span></div>
            <div className="sc-tr fin"><span>합계</span><span>{fmtNumber(total)}원</span></div>
          </div>
        </div>
        {memoSection}
        {extrasSection}
      </div>
      <div className="sc-footer" />
    </div>
  );
}
