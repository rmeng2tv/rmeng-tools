import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-name">알맹이툴즈</span>
          <span className="footer-by">운영 · 알맹이컴퍼니</span>
        </div>

        <nav className="footer-nav" aria-label="하단 메뉴">
          <Link to="/about" className="footer-link">사이트 소개</Link>
          <Link to="/privacy" className="footer-link">개인정보처리방침</Link>
          <Link to="/terms" className="footer-link">이용약관</Link>
          <a href="mailto:rmeng2tv@gmail.com" className="footer-link">문의</a>
        </nav>

        <div className="footer-meta">
          <span>알맹이컴퍼니 · 사업자등록번호 447-51-00496</span>
          <span>경기도 시흥시 · rmeng2tv@gmail.com</span>
          <span className="footer-copy">© 2026 알맹이컴퍼니. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
