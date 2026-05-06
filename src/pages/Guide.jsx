import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Guide() {
  return (
    <>
      <Header />
      <main className="guide-page">
        <div className="guide-inner">
          <div className="guide-head">
            <div className="guide-tag">이용가이드</div>
            <h1 className="guide-title">알맹이툴즈 사용법</h1>
            <p className="guide-lead">
              회원가입 없이 무료로 사용하는 비즈니스 도구 모음입니다.
              현재는 견적서 도구가 제공되며, 앞으로 재직증명서·연봉계산기·부가세 계산기 등 다양한 도구가 추가될 예정입니다.
            </p>
          </div>

          <section className="guide-section">
            <h2 className="guide-h2">견적서 만들기 — 4단계로 끝</h2>
            <p className="guide-desc">
              모든 단계는 우측 실시간 미리보기로 즉시 확인할 수 있습니다. PC에서 작성을 권장합니다.
            </p>

            <ol className="guide-steps">
              <li className="guide-step">
                <div className="guide-step-num">STEP 1</div>
                <div className="guide-step-body">
                  <h3>받는 분 정보 입력</h3>
                  <p>
                    견적서를 받는 업체명·담당자명을 입력합니다. 사업자/개인 구분이 가능하며,
                    사업자번호·주소 같은 추가 정보는 모두 <strong>선택 입력</strong>입니다.
                  </p>
                </div>
              </li>

              <li className="guide-step">
                <div className="guide-step-num">STEP 2</div>
                <div className="guide-step-body">
                  <h3>스타일 선택</h3>
                  <p>
                    3가지 디자인 중 마음에 드는 스타일을 고릅니다. 우측 미리보기에서 즉시 적용된 모습을 확인할 수 있습니다.
                  </p>
                </div>
              </li>

              <li className="guide-step">
                <div className="guide-step-num">STEP 3</div>
                <div className="guide-step-body">
                  <h3>품목 입력 + 세금 처리</h3>
                  <p>
                    품목·수량·단가를 입력하면 <strong>공급가액과 세액이 자동 계산</strong>됩니다.
                    부가세 처리 방식은 ① 일반(공급가+세액) ② 부가세 포함 ③ 부가세 0원(면세) 중에서 선택할 수 있습니다.
                  </p>
                </div>
              </li>

              <li className="guide-step">
                <div className="guide-step-num">STEP 4</div>
                <div className="guide-step-body">
                  <h3>발신자 정보 + 도장 + 메모</h3>
                  <p>
                    발신자(우리 회사) 정보를 입력하고, <strong>12종 도장 디자인</strong> 중 골라 바로 찍을 수 있습니다.
                    자주 쓰는 안내 문구는 체크박스로 켜고 끌 수 있으며, 발신자 정보는 다음 견적서 작성 시 자동으로 불러옵니다.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="guide-section">
            <h2 className="guide-h2">완성 후</h2>
            <ul className="guide-list">
              <li>입금계좌·유효기간·결제조건 등 추가 항목을 클릭 한 번으로 견적서 하단에 삽입</li>
              <li>PDF 또는 이미지로 다운로드해서 메일·메신저로 전달</li>
              <li>인쇄 시 A4 한 장에 깔끔하게 출력</li>
            </ul>
          </section>

          <section className="guide-section">
            <h2 className="guide-h2">자주 묻는 질문</h2>
            <div className="guide-faq">
              <div className="guide-faq-item">
                <h3>입력한 정보는 저장되나요?</h3>
                <p>
                  발신자(우리 회사) 정보·자주 쓰는 메모·도장 설정은 사용 중인 브라우저에 저장됩니다.
                  서버로 전송되지 않으며, 다른 기기·다른 브라우저에서는 보이지 않습니다.
                </p>
              </div>
              <div className="guide-faq-item">
                <h3>모바일에서도 사용할 수 있나요?</h3>
                <p>
                  견적서 작성은 PC 환경을 권장합니다. 항목 표·도장 위치 조정 등 정밀 작업이 많아 모바일에서는 사용성이 떨어집니다.
                </p>
              </div>
              <div className="guide-faq-item">
                <h3>요금이 발생하나요?</h3>
                <p>
                  무료입니다. 회원가입·결제 없이 모든 기능을 사용할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <div className="guide-cta">
            <Link to="/" className="guide-btn">견적서 만들러 가기 →</Link>
          </div>
        </div>
      </main>
    </>
  );
}
