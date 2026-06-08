import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SampleCard from '../components/SampleCard';
import { GUIDE_SAMPLES } from './guideSamples';

export default function Guide() {
  return (
    <>
      <Header />
      <main className="guide-page">
        <div className="guide-inner">
          <div className="guide-hero">
            <div className="guide-tag">견적서 샘플</div>
            <h1 className="guide-hero-title">이런 견적서를 1분 만에, 무료로</h1>
            <p className="guide-hero-lead">
              회원가입 없이 품목만 입력하면 끝. 3가지 디자인 중 마음에 드는 스타일을 골라
              바로 PDF로 받아보세요.
            </p>
            <Link to="/" className="guide-btn">견적서 만들러 가기 →</Link>
          </div>

          <section className="guide-section">
            <h2 className="guide-h2">디자인 3종</h2>
            <p className="guide-desc">아래 견적서는 실제로 생성된 결과물입니다. 마음에 드는 카드를 누르면 그 스타일로 바로 시작합니다.</p>
            <div className="sample-grid">
              {GUIDE_SAMPLES.map(sample => (
                <SampleCard key={sample.style} sample={sample} />
              ))}
            </div>
          </section>

          <section className="guide-section">
            <h2 className="guide-h2">자주 묻는 질문</h2>
            <div className="guide-faq">
              <div className="guide-faq-item">
                <h3>요금이 발생하나요?</h3>
                <p>무료입니다. 회원가입·결제 없이 모든 기능을 사용할 수 있습니다.</p>
              </div>
              <div className="guide-faq-item">
                <h3>입력한 정보는 저장되나요?</h3>
                <p>
                  발신자(우리 회사) 정보·자주 쓰는 메모·도장 설정은 사용 중인 브라우저에만 저장됩니다.
                  서버로 전송되지 않으며 다른 기기에서는 보이지 않습니다.
                </p>
              </div>
              <div className="guide-faq-item">
                <h3>모바일에서도 되나요?</h3>
                <p>
                  됩니다. 다만 품목 표·도장 위치 조정 같은 정밀 작업이 많아 PC에서 더 편하게 작성할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <div className="guide-cta">
            <Link to="/" className="guide-btn">견적서 만들러 가기 →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
