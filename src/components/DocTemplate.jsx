import { calcTax } from '../utils/taxCalc';
import { fmtNumber } from '../utils/formatters';

// 오늘 날짜 문자열
const now = new Date();
const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

// 일련번호 (세션당 1회 생성, 있어 보이는 랜덤 코드)
function generateDocNum() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `QQ-${code.slice(0, 3)}${code.slice(3)}`;
}
const docNum = generateDocNum();

export default function DocTemplate({ state, currentStep }) {
  const { receiver, docStyle, items, taxMode, sender, memoItems, extras } = state;
  const { supply, vat, total, vatLabel } = calcTax(items, taxMode);

  const blurred = currentStep < 3;
  const filledItems = items.filter(i => i.name || i.price);
  const activeMemos = memoItems.filter(m => m.on);
  const senderLine2 = sender.ceo ? sender.ceo + ' 대표' : '';
  const senderLine3 = [sender.bizNum, sender.tel].filter(Boolean).join(' \u00B7 ');

  // 추가 제안 (extras)
  const extraMap = {
    bank: '입금 계좌',
    expiry: '견적 유효기간',
    contact: '담당자 연락처',
    payment: '결제 조건',
  };
  const activeExtras = Object.entries(extras).filter(([, v]) => v.on);

  // 공통 영역: 수신/발신 메타
  const meta = (
    <div className="doc-meta">
      <div className="doc-mc">
        <span className="doc-ml">수신</span>
        <span className="doc-mv">{receiver.name || '\u2014'}</span>
        <span className="doc-msub">{receiver.person ? receiver.person + ' 귀하' : ''}</span>
      </div>
      <div className="doc-mc" style={{ textAlign: 'right' }}>
        <span className="doc-ml">발신</span>
        <span className="doc-mv">{sender.name || '\u2014'}</span>
        {senderLine2 && <span className="doc-msub">{senderLine2}</span>}
        {senderLine3 && <span className="doc-msub">{senderLine3}</span>}
      </div>
    </div>
  );

  // 공통 영역: 품목 테이블
  const itemTable = (
    <table className="dtbl">
      <thead>
        <tr style={docStyle === 'c' ? { background: '#dcfce7' } : undefined}>
          <th>품목명</th>
          <th style={{ textAlign: 'right' }}>단가</th>
          <th style={{ textAlign: 'right' }}>수량</th>
          <th style={{ textAlign: 'right' }}>금액</th>
        </tr>
      </thead>
      <tbody>
        {filledItems.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 14, fontSize: 10 }}>
              품목을 입력하면 여기에 표시돼요
            </td>
          </tr>
        ) : (
          filledItems.map(item => (
            <tr key={item.id}>
              <td>{item.name || '\u2014'}</td>
              <td className="r">{item.price ? fmtNumber(item.price) + '원' : '\u2014'}</td>
              <td className="r">{item.qty}</td>
              <td className="r">{item.price ? fmtNumber(item.price * item.qty) + '원' : '\u2014'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  // 공통 영역: 합계
  const totStyle = docStyle === 'c'
    ? { background: '#dcfce7', borderColor: '#bbf7d0' }
    : undefined;
  const finStyle = docStyle === 'c'
    ? { color: '#16a34a', borderColor: '#bbf7d0' }
    : undefined;

  const totBox = (
    <div className="dtot-wrap">
      <div className="dtot" style={totStyle}>
        <div className="dtr"><span>공급가액</span><span>{fmtNumber(supply)}원</span></div>
        <div className="dtr"><span>{vatLabel}</span><span>{fmtNumber(vat)}원</span></div>
        <div className="dtr fin" style={finStyle}><span>합계</span><span>{fmtNumber(total)}원</span></div>
      </div>
    </div>
  );

  // 공통 영역: 메모 (각 항목을 개별 블록으로 분리)
  const memoSection = activeMemos.length > 0 && (
    <div className="doc-memo" data-break="memo">
      <div className="doc-memo-title">특이사항</div>
      {activeMemos.map(m => (
        <div className="doc-memo-item" data-break="memo-item" key={m.id}>{'\u2022'} {m.text}</div>
      ))}
    </div>
  );

  // 공통 영역: 추가 제안 (각 박스를 개별 블록으로)
  const extrasSection = activeExtras.length > 0 && (
    <div className="doc-extras">
      {activeExtras.map(([key, val]) => (
        <div className="doc-extra-box" data-break="extra" key={key}>
          <div className="doc-extra-label">{extraMap[key]}</div>
          <div className="doc-extra-val">{val.value || '입력 중...'}</div>
        </div>
      ))}
    </div>
  );

  // ── 스타일 A: 모던 미니멀 ──
  if (docStyle === 'a') {
    return (
      <div className="doc">
        <div className="doc-topbar" />
        <div className="doc-toprow">
          <div>
            <div className="doc-title">견 적 서</div>
            <div className="doc-num">{docNum}</div>
          </div>
          <div className="doc-date">{dateStr}</div>
        </div>
        {meta}
        <div className={`bwrap${blurred ? ' blurred' : ' clear'}`}>
          {itemTable}
          {totBox}
          {memoSection}
          {extrasSection}
        </div>
        {/* 도장 — 추후 추가 예정 */}
      </div>
    );
  }

  // ── 스타일 B: 클래식 비즈 ──
  if (docStyle === 'b') {
    return (
      <div className="doc" style={{ paddingTop: 0 }}>
        <div className="doc-hblock">
          <div className="doc-title-w">견 적 서</div>
          <div className="doc-num-w">{docNum}</div>
        </div>
        <div className="doc-toprow" style={{ marginBottom: 11 }}>
          <div />
          <div className="doc-date">{dateStr}</div>
        </div>
        {meta}
        <div className={`bwrap${blurred ? ' blurred' : ' clear'}`}>
          {itemTable}
          {totBox}
          {memoSection}
          {extrasSection}
        </div>
        {/* 도장 — 추후 추가 예정 */}
      </div>
    );
  }

  // ── 스타일 C: 컬러 프리미엄 ──
  if (docStyle === 'c') {
    return (
      <div className="doc">
        <div className="doc-adots">
          <div className="doc-adot" style={{ background: '#2563eb' }} />
          <div className="doc-adot" style={{ background: '#10b981' }} />
          <div className="doc-adot" style={{ background: '#f59e0b' }} />
        </div>
        <div className="doc-toprow">
          <div>
            <div className="doc-title">견 적 서</div>
            <div className="doc-num">{docNum}</div>
          </div>
          <div className="doc-date">{dateStr}</div>
        </div>
        {meta}
        <div className={`bwrap${blurred ? ' blurred' : ' clear'}`}>
          {itemTable}
          {totBox}
          {memoSection}
          {extrasSection}
        </div>
      </div>
    );
  }

  // ── 스타일 D: 웜 내추럴 ──
  return (
    <div className="doc" style={{ background: '#faf8f5' }}>
      <div style={{ height: 2, borderRadius: 1, marginBottom: 12, background: '#78716c' }} />
      <div className="doc-toprow">
        <div>
          <div className="doc-title" style={{ color: '#44403c' }}>견 적 서</div>
          <div className="doc-num">{docNum}</div>
        </div>
        <div className="doc-date">{dateStr}</div>
      </div>
      <div className="doc-meta" style={{ background: '#f5f0eb' }}>
        <div className="doc-mc">
          <span className="doc-ml">수신</span>
          <span className="doc-mv" style={{ color: '#44403c' }}>{receiver.name || '\u2014'}</span>
          <span className="doc-msub">{receiver.person ? receiver.person + ' 귀하' : ''}</span>
        </div>
        <div className="doc-mc" style={{ textAlign: 'right' }}>
          <span className="doc-ml">발신</span>
          <span className="doc-mv" style={{ color: '#44403c' }}>{sender.name || '\u2014'}</span>
          {senderLine2 && <span className="doc-msub">{senderLine2}</span>}
          {senderLine3 && <span className="doc-msub">{senderLine3}</span>}
        </div>
      </div>
      <div className={`bwrap${blurred ? ' blurred' : ' clear'}`}>
        {itemTable}
        <div className="dtot-wrap">
          <div className="dtot" style={{ background: '#f5f0eb', borderColor: '#d6cfc7' }}>
            <div className="dtr"><span>공급가액</span><span>{fmtNumber(supply)}원</span></div>
            <div className="dtr"><span>{vatLabel}</span><span>{fmtNumber(vat)}원</span></div>
            <div className="dtr fin" style={{ color: '#78716c', borderColor: '#d6cfc7' }}><span>합계</span><span>{fmtNumber(total)}원</span></div>
          </div>
        </div>
        {memoSection}
        {extrasSection}
      </div>
    </div>
  );
}
