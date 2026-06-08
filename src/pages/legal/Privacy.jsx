import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-inner">
          <h1 className="legal-title">개인정보처리방침</h1>
          <p className="legal-updated">최종 개정일: 2026년 6월 9일</p>

          <p className="legal-lead">
            알맹이컴퍼니(이하 “회사”)는 알맹이툴즈(tools.rmeng2.co.kr, 이하 “서비스”)를
            운영하면서 이용자의 개인정보를 소중하게 생각하며, 「개인정보 보호법」 등
            관련 법령을 준수합니다. 본 방침은 회사가 어떤 정보를 어떻게 다루는지 설명합니다.
          </p>

          <section className="legal-section">
            <h2>1. 회사가 수집·저장하지 않는 정보</h2>
            <p>
              알맹이툴즈는 회원가입이나 로그인이 없는 서비스입니다. 이용자가 견적서를
              만들기 위해 입력하는 수신자·발신자 정보, 품목, 도장 설정 등의 내용은
              <strong> 회사 서버로 전송되거나 저장되지 않습니다.</strong> 해당 정보는
              이용자가 사용하는 브라우저의 로컬 저장소(localStorage)에만 보관되며,
              같은 기기·같은 브라우저에서만 다시 불러올 수 있습니다.
            </p>
            <p>
              브라우저에 저장된 정보는 이용자가 브라우저의 “인터넷 사용 기록 삭제” 또는
              저장소 비우기를 실행하면 즉시 삭제됩니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. 쿠키 및 자동 수집 정보</h2>
            <p>
              서비스 품질 개선과 광고 게재를 위해 다음과 같은 도구가 쿠키 또는
              유사 기술을 사용하여 일부 정보(접속 기기, 브라우저 종류, 방문 페이지 등)를
              자동으로 수집할 수 있습니다.
            </p>
            <ul className="legal-list">
              <li>
                <strong>Google AdSense (광고):</strong> 구글 및 광고 파트너는 쿠키를
                사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 제공할 수
                있습니다.
              </li>
              <li>
                <strong>방문 통계:</strong> 서비스 이용 현황 파악을 위해 익명화된
                접속 통계가 수집될 수 있습니다.
              </li>
            </ul>
            <p>
              이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으며, 구글의
              광고 설정 페이지(
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                google.com/settings/ads
              </a>
              )에서 맞춤형 광고를 끌 수 있습니다. 또한
              <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer"> www.aboutads.info</a>
              에서 제3자 공급업체의 쿠키 사용을 거부할 수 있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. 제3자 제공 및 위탁</h2>
            <p>
              회사는 이용자의 개인정보를 제3자에게 판매하거나 제공하지 않습니다.
              다만 위 2항의 광고·통계 서비스 운영을 위해 해당 사업자(Google LLC 등)의
              쿠키 기술이 사용될 수 있으며, 이는 각 사업자의 개인정보처리방침을 따릅니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. 이용자의 권리</h2>
            <p>
              브라우저에 저장된 정보는 전적으로 이용자의 기기에 있으므로, 이용자는
              언제든지 브라우저 설정을 통해 저장 정보를 확인·삭제할 수 있습니다.
              쿠키 거부 시 일부 기능 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. 개인정보 보호책임자 및 문의</h2>
            <ul className="legal-list">
              <li>운영자: 알맹이컴퍼니</li>
              <li>사업자등록번호: 447-51-00496</li>
              <li>이메일: rmeng2tv@gmail.com</li>
              <li>주소: 경기도 시흥시</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. 방침의 변경</h2>
            <p>
              본 개인정보처리방침은 법령 또는 서비스 변경에 따라 개정될 수 있으며,
              개정 시 본 페이지를 통해 공지합니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
