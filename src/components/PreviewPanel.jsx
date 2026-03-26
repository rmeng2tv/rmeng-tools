import DocTemplate from './DocTemplate';

export default function PreviewPanel({ state, currentStep }) {
  const { receiver, sender, items } = state;

  // 진행도 상태 텍스트
  const filled = [receiver.name, sender.name].filter(Boolean).length
    + (items.some(i => i.name) ? 1 : 0);
  const statusText =
    filled === 0 ? '입력 중...' :
    filled === 1 ? '조금 더...' :
    filled === 2 ? '절반 완성!' :
    '거의 다 됐어요!';

  return (
    <div className="pvpanel">
      <div className="pvhdr">
        <span className="pvlabel">실시간 미리보기</span>
        <span className="pvst">{statusText}</span>
      </div>
      <div className="pvbody">
        <DocTemplate state={state} currentStep={currentStep} />
      </div>
    </div>
  );
}
