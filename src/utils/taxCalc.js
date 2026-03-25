/**
 * 세금 계산
 * @param {Array} items - [{ price, qty }, ...]
 * @param {'normal'|'include'|'zero'} taxMode
 * @returns {{ supply: number, vat: number, total: number, vatLabel: string }}
 */
export function calcTax(items, taxMode) {
  const raw = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  let supply, vat, total;

  if (taxMode === 'include') {
    supply = Math.round(raw / 1.1);
    vat = raw - supply;
    total = raw;
  } else if (taxMode === 'zero') {
    supply = raw;
    vat = 0;
    total = raw;
  } else {
    supply = raw;
    vat = Math.round(raw * 0.1);
    total = supply + vat;
  }

  const vatLabel =
    taxMode === 'zero' ? '부가세 (면세)' :
    taxMode === 'include' ? '부가세 (포함)' :
    '부가세 (10%)';

  return { supply, vat, total, vatLabel };
}
