import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-inner">
          <h1 className="legal-title">사이트 소개</h1>

          <section className="legal-section">
            <h2>알맹이툴즈란?</h2>
            <p>
              알맹이툴즈는 사업자와 프리랜서가 매번 번거롭게 만들던 비즈니스 서류를
              <strong> 회원가입 없이, 무료로, 몇 분 만에</strong> 작성할 수 있도록 돕는
              온라인 도구 모음입니다. 복잡한 양식이나 엑셀 없이 필요한 항목만 입력하면
              깔끔한 문서를 PDF·이미지로 바로 받아볼 수 있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제공하는 도구</h2>
            <ul className="legal-list">
              <li>
                <strong>견적서 만들기</strong> — 수신자·품목·세금·도장까지 한 번에.
                3가지 디자인과 12종 도장(직인)을 지원합니다.
              </li>
              <li>그 외 재직증명서, 연봉 계산기, 부가세 계산기 등을 순차적으로 추가할 예정입니다.</li>
            </ul>
            <p>
              <Link to="/guide" className="legal-inline-link">견적서 샘플 보러 가기 →</Link>
            </p>
          </section>

          <section className="legal-section">
            <h2>개인정보를 다루는 방식</h2>
            <p>
              알맹이툴즈는 입력한 내용을 서버에 저장하지 않습니다. 작성한 정보는
              이용자의 브라우저에만 보관되어, 안심하고 사용할 수 있습니다. 자세한 내용은
              <Link to="/privacy" className="legal-inline-link"> 개인정보처리방침</Link>을
              참고해 주세요.
            </p>
          </section>

          <section className="legal-section">
            <h2>운영 정보</h2>
            <ul className="legal-list">
              <li>운영자: 알맹이컴퍼니</li>
              <li>사업자등록번호: 447-51-00496</li>
              <li>주소: 경기도 시흥시</li>
              <li>이메일: rmeng2tv@gmail.com</li>
              <li>
                홈페이지:{' '}
                <a href="https://rmeng2.co.kr" target="_blank" rel="noopener noreferrer" className="legal-inline-link">
                  rmeng2.co.kr
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
