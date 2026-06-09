import Header from './Header';

// 토스 미니앱(앱인토스) 빌드 여부 — 토스 내비바가 앱명을 표시하므로 자체 헤더는 숨김
const IS_TOSS = import.meta.env.MODE === 'toss';

export default function ProgressBar({ currentStep }) {
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${progress}%` }} />
      </div>
      {!IS_TOSS && (
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
      )}
    </>
  );
}
