/**
 * 전화번호 포맷 (010- 고정, 최대 11자리)
 * '01012345678' → '010-1234-5678'
 */
export function fmtTel(value) {
  let v = value.replace(/\D/g, '');
  if (!v.startsWith('010')) v = '010';
  v = v.slice(0, 11);

  if (v.length <= 3) return v;
  if (v.length <= 7) return v.slice(0, 3) + '-' + v.slice(3);
  return v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
}

/**
 * 사업자번호 포맷 (3-2-5)
 * '1234567890' → '123-45-67890'
 */
export function fmtBiz(value) {
  const v = value.replace(/\D/g, '').slice(0, 10);

  if (v.length <= 3) return v;
  if (v.length <= 5) return v.slice(0, 3) + '-' + v.slice(3);
  return v.slice(0, 3) + '-' + v.slice(3, 5) + '-' + v.slice(5);
}

/**
 * 숫자 천 단위 콤마
 * 1000000 → '1,000,000'
 */
export function fmtNumber(n) {
  return (n || 0).toLocaleString('ko-KR');
}
