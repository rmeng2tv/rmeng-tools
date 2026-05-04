/**
 * 견적서 전체 합계 계산
 * @param {Array} items - [{ price, qty }, ...]
 * @param {'normal'|'include'|'zero'|'hidden'} taxMode
 * @returns {{ supply: number, vat: number, total: number, vatLabel: string }}
 *
 * normal: 부가세 별도 (10%)
 * include: 부가세 포함 (역산)
 * zero: 면세 (vat=0)
 * hidden: 표시 숨김 (계산은 zero와 동일, 렌더링 시 행 숨김)
 */
export function calcTax(items, taxMode) {
  const raw = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  let supply, vat, total;

  if (taxMode === 'include') {
    supply = Math.round(raw / 1.1);
    vat = raw - supply;
    total = raw;
  } else if (taxMode === 'zero' || taxMode === 'hidden') {
    supply = raw;
    vat = 0;
    total = raw;
  } else {
    // normal
    supply = raw;
    vat = Math.round(raw * 0.1);
    total = supply + vat;
  }

  const vatLabel =
    taxMode === 'zero' ? '부가세 (면세)' :
    taxMode === 'include' ? '부가세 (포함)' :
    taxMode === 'hidden' ? '부가세' :
    '부가세 (10%)';

  return { supply, vat, total, vatLabel };
}

/**
 * 항목별 공급가액/세액 계산 (테이블 행 표시용)
 * @param {{ price, qty }} item
 * @param {'normal'|'include'|'zero'|'hidden'} taxMode
 * @returns {{ supply: number, tax: number }}
 *
 * 주의: include 모드에서 항목별 supply 합 ≠ 전체 supply (반올림 1원 오차)
 *       의도된 차이로, 화면엔 항목별/전체 모두 표시되지만 사용자 영향은 없음
 */
export function calcItemTax(item, taxMode) {
  const raw = (item.price || 0) * (item.qty || 1);

  if (taxMode === 'include') {
    const supply = Math.round(raw / 1.1);
    return { supply, tax: raw - supply };
  }
  if (taxMode === 'normal') {
    return { supply: raw, tax: Math.round(raw * 0.1) };
  }
  // zero, hidden
  return { supply: raw, tax: 0 };
}
