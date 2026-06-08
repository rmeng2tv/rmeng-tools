import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Terms() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-inner">
          <h1 className="legal-title">이용약관</h1>
          <p className="legal-updated">최종 개정일: 2026년 6월 9일</p>

          <section className="legal-section">
            <h2>제1조 (목적)</h2>
            <p>
              본 약관은 알맹이컴퍼니(이하 “회사”)가 제공하는 알맹이툴즈
              (tools.rmeng2.co.kr, 이하 “서비스”) 이용과 관련하여 회사와 이용자 간의
              권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제2조 (서비스의 내용)</h2>
            <p>
              서비스는 회원가입 없이 견적서를 비롯한 사업자·프리랜서용 서류를
              온라인에서 작성하고 PDF·이미지로 내려받을 수 있는 무료 도구를 제공합니다.
              서비스의 구체적인 기능은 회사의 사정에 따라 추가·변경될 수 있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제3조 (이용요금)</h2>
            <p>
              서비스의 기본 기능은 무료로 제공됩니다. 일부 기능은 광고 시청을 조건으로
              제공될 수 있으며, 서비스 화면에는 광고가 게재될 수 있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제4조 (이용자의 책임)</h2>
            <ul className="legal-list">
              <li>
                이용자는 서비스로 작성한 서류의 내용(금액, 사업자 정보, 세금 계산 등)의
                정확성을 스스로 확인할 책임이 있습니다.
              </li>
              <li>
                이용자는 서비스를 법령과 본 약관에 위배되는 목적으로 사용해서는 안 됩니다.
              </li>
              <li>
                서비스에서 작성한 내용은 이용자의 브라우저에만 저장되므로, 보관·백업의
                책임은 이용자에게 있습니다.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>제5조 (면책)</h2>
            <p>
              서비스는 “있는 그대로(as-is)” 제공됩니다. 회사는 서비스로 생성된 서류의
              내용이나 이를 사용함으로써 발생한 결과(세무·법률·금전적 손해 등)에 대해
              책임을 지지 않습니다. 세무·법률 관련 사항은 전문가의 확인을 권장합니다.
            </p>
            <p>
              또한 천재지변, 시스템 장애, 호스팅·제3자 서비스 중단 등 회사의 통제를
              벗어난 사유로 인한 서비스 중단에 대해서는 책임을 지지 않습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제6조 (저작권)</h2>
            <p>
              서비스의 디자인, 로고, 콘텐츠에 대한 저작권은 회사에 있습니다.
              이용자가 서비스로 작성한 견적서 등 서류의 내용에 대한 권리는 이용자에게
              있습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제7조 (약관의 변경)</h2>
            <p>
              회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 본 페이지에
              게시함으로써 효력이 발생합니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>문의</h2>
            <p>알맹이컴퍼니 · 이메일 rmeng2tv@gmail.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
