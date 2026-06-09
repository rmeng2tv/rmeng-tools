import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useQuote from '../../hooks/useQuote';
import ProgressBar from '../../components/ProgressBar';
import PreviewPanel from '../../components/PreviewPanel';
import DocTemplate from '../../components/DocTemplate';
import TrustBar from '../../components/TrustBar';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Complete from './Complete';
import { downloadPDF, downloadImage } from '../../utils/pdfExport';

// 토스 미니앱(앱인토스) 빌드 여부
const IS_TOSS = import.meta.env.MODE === 'toss';

export default function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const {
    state,
    updateReceiver,
    setDocStyle,
    setQuoteTitle,
    toggleShowSpec,
    addItem,
    updateItem,
    deleteItem,
    setTaxMode,
    updateSender,
    toggleMemo,
    editMemo,
    deleteMemo,
    moveMemo,
    addMemo,
    restoreDefaultMemos,
    updateStamp,
    toggleExtra,
    updateExtra,
    resetAll,
  } = useQuote();

  // 샘플 페이지(/guide)에서 /?style=b 로 들어온 경우 해당 스타일 미리 선택
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const s = searchParams.get('style');
    if (s === 'a' || s === 'b' || s === 'c') setDocStyle(s);
    // 진입 시 1회만 적용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 뒤로가기(토스 내비바 ← / 브라우저 뒤로) → 위저드 이전 단계로 (히스토리 연동)
  // Step1에서 뒤로가기 = 기록이 없어 미니앱/페이지 종료 (가이드 요구 충족)
  useEffect(() => {
    window.history.replaceState({ view: 1 }, '');
    const onPop = (e) => {
      const v = e.state?.view;
      if (v === 'complete') { setCompleted(true); setCurrentStep(4); }
      else if (typeof v === 'number') { setCompleted(false); setCurrentStep(v); }
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 토스 내비바 ← 는 브라우저 뒤로가 아니라 graniteEvent 'backEvent'로 옴.
  // Step2~4·완성에서만 핸들러 등록(이전 단계로 이동). Step1에선 미등록 → 토스 기본 동작(미니앱 닫기).
  useEffect(() => {
    if (!IS_TOSS) return;
    if (!completed && currentStep === 1) return;
    let unsub, cancelled = false;
    import('@apps-in-toss/web-framework').then(({ graniteEvent }) => {
      if (cancelled) return;
      unsub = graniteEvent.addEventListener('backEvent', {
        onEvent: () => window.history.back(),
      });
    });
    return () => { cancelled = true; if (unsub) unsub(); };
  }, [currentStep, completed]);

  function goTo(step) {
    setCurrentStep(step);
    window.scrollTo(0, 0);
    window.history.pushState({ view: step }, '');
  }

  function handleFinish() {
    setCompleted(true);
    window.history.pushState({ view: 'complete' }, '');
  }

  async function handleDownloadPDF() {
    setCapturing(true);
    await new Promise(r => setTimeout(r, 500));
    if (captureRef.current) {
      await downloadPDF(captureRef.current, state.receiver.name);
    }
    setCapturing(false);
  }

  async function handleDownloadImage() {
    setCapturing(true);
    await new Promise(r => setTimeout(r, 500));
    if (captureRef.current) {
      await downloadImage(captureRef.current, state.receiver.name);
    }
    setCapturing(false);
  }

  function handleBack() {
    window.history.back();
  }

  return (
    <>
      <ProgressBar currentStep={completed ? 5 : currentStep} />

      <div className="layout">
        <div className="content-col">
          {currentStep === 1 && (
            <Step1
              state={state}
              updateReceiver={updateReceiver}
              setQuoteTitle={setQuoteTitle}
              onNext={() => goTo(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2
              state={state}
              setDocStyle={setDocStyle}
              onPrev={() => window.history.back()}
              onNext={() => goTo(3)}
            />
          )}
          {currentStep === 3 && (
            <Step3
              state={state}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
              setTaxMode={setTaxMode}
              toggleShowSpec={toggleShowSpec}
              onPrev={() => window.history.back()}
              onNext={() => goTo(4)}
            />
          )}
          {currentStep === 4 && (
            <Step4
              state={state}
              updateSender={updateSender}
              toggleMemo={toggleMemo}
              editMemo={editMemo}
              deleteMemo={deleteMemo}
              moveMemo={moveMemo}
              addMemo={addMemo}
              restoreDefaultMemos={restoreDefaultMemos}
              onPrev={() => window.history.back()}
              onFinish={handleFinish}
            />
          )}

          {/* 신뢰배너 임시 숨김 — 위치 재검토 후 복구 예정 */}
          {/* {!isMobile && <TrustBar />} */}
        </div>

        {!isMobile && (
          <PreviewPanel
            state={state}
            currentStep={completed ? 5 : currentStep}
          />
        )}
      </div>

      <Complete
        show={completed}
        state={state}
        toggleExtra={toggleExtra}
        updateExtra={updateExtra}
        onDownloadPDF={handleDownloadPDF}
        onDownloadImage={handleDownloadImage}
        onBack={handleBack}
      />

      {/* 캡처/인쇄용 — 다운로드 시 잠깐 표시 (A4 원본 794×1123 비율) */}
      {capturing && (
        <div className="print-target" style={{
          position: 'fixed', top: 0, left: 0, width: 794,
          zIndex: 99999, background: '#fff',
        }}>
          <div ref={captureRef}>
            <DocTemplate state={state} currentStep={99} />
          </div>
        </div>
      )}
    </>
  );
}
