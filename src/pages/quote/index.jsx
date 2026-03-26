import { useState } from 'react';
import useQuote from '../../hooks/useQuote';
import ProgressBar from '../../components/ProgressBar';
import PreviewPanel from '../../components/PreviewPanel';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Complete from './Complete';

export default function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

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

  function handleDownload() {
    alert('광고 1회 시청 후 PDF 다운로드!\n(추후 리워드 광고 + jsPDF 연동 예정)');
  }

  function handleRedo() {
    setCompleted(false);
    setCurrentStep(1);
    resetAll();
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
              moveMemo={moveMemo}
              addMemo={addMemo}
              updateStamp={updateStamp}
              onPrev={() => goTo(3)}
              onFinish={handleFinish}
            />
          )}
        </div>

        {/* 우측 프리뷰 — Phase 4에서 구현 */}
        <PreviewPanel state={state} currentStep={currentStep} />
      </div>

      <Complete
        show={completed}
        state={state}
        toggleExtra={toggleExtra}
        updateExtra={updateExtra}
        onDownload={handleDownload}
        onRedo={handleRedo}
      />
    </>
  );
}
