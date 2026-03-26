import { useState, useRef } from 'react';
import useQuote from '../../hooks/useQuote';
import ProgressBar from '../../components/ProgressBar';
import PreviewPanel from '../../components/PreviewPanel';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Complete from './Complete';
import { downloadPDF, downloadImage } from '../../utils/pdfExport';

export default function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const docRef = useRef(null);

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
    if (!docRef.current) return;
    // 추후 리워드 광고 자리 (Phase 8)
    await downloadPDF(docRef.current, state.receiver.name);
  }

  async function handleDownloadImage() {
    if (!docRef.current) return;
    await downloadImage(docRef.current, state.receiver.name);
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
          docRef={docRef}
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
    </>
  );
}
