export default function TrustBar() {
  return (
    <div className="trustbar">
      <div className="tb-item">
        <div className="tb-num">1,247</div>
        <div className="tb-label">지금까지 만들어진 견적서</div>
      </div>
      <div className="tb-divider" />
      <div className="tb-item">
        <div className="tb-num">2분 38초</div>
        <div className="tb-label">평균 작성 시간</div>
      </div>
      <div className="tb-divider" />
      <div className="tb-item">
        <div className="tb-num">100%</div>
        <div className="tb-label">무료 · 로그인 없음</div>
      </div>
    </div>
  );
}
