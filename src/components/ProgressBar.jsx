import Header from './Header';

export default function ProgressBar({ currentStep }) {
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${progress}%` }} />
      </div>
      <Header>
        <div className="hdots" aria-label={`${currentStep}/4 단계`}>
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`dot${n < currentStep ? ' done' : n === currentStep ? ' active' : ''}`}
            />
          ))}
        </div>
      </Header>
    </>
  );
}
