import { useState, useRef } from 'react';
import useQuote from '../../hooks/useQuote';
import ProgressBar from '../../components/ProgressBar';
import PreviewPanel from '../../components/PreviewPanel';
import DocTemplate from '../../components/DocTemplate';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Complete from './Complete';
import { downloadPDF, downloadImage } from '../../utils/pdfExport';

export default function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef(null);

  const {
    state,
    updateReceiver,
    setDocStyle,
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
    updateStamp,
    toggleExtra,
    updateExtra,
    resetAll,
  } = useQuote();

  function goTo(step) {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  }

  function handleFinish() {
    setCompleted(true);
  }

  async function handleDownloadPDF() {
    setCapturing(true);
    await new Promise(r => setTimeout(r, 500));
    window.print();
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
    setCompleted(false);
    setCurrentStep(4);
  }

  return (
    <>
      <ProgressBar currentStep={completed ? 5 : currentStep} />

      <div className="layout">
        <div>
          {currentStep === 1 && (
            <Step1
              state={state}
              updateReceiver={updateReceiver}
              onNext={() => goTo(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2
              state={state}
              setDocStyle={setDocStyle}
              onPrev={() => goTo(1)}
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
              onPrev={() => goTo(2)}
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
              onPrev={() => goTo(3)}
              onFinish={handleFinish}
            />
          )}
        </div>

        <PreviewPanel
          state={state}
          currentStep={completed ? 5 : currentStep}
        />
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

      {/* 캡처/인쇄용 — 다운로드 시 잠깐 표시 */}
      {capturing && (
        <div className="print-target" style={{
          position: 'fixed', top: 0, left: 0, width: 380, padding: 16,
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
