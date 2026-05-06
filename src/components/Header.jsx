import { Link } from 'react-router-dom';
import logoImg from '../assets/icons/logo.png';

export default function Header({ children }) {
  return (
    <header className="hdr">
      <Link to="/" className="logo-link" aria-label="알맹이툴즈 홈">
        <img src={logoImg} alt="알맹이툴즈" className="logo-img" />
      </Link>

      <nav className="nav-menu" aria-label="주 메뉴">
        <Link to="/guide" className="nav-link">이용가이드</Link>
        <a
          href="https://rmeng2.co.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link nav-ext"
        >
          알맹이컴퍼니<span className="ext-arrow" aria-hidden="true">↗</span>
        </a>
        <a
          href="http://pf.kakao.com/_epaxbn/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          문의하기
        </a>
      </nav>

      {children}
    </header>
  );
}
