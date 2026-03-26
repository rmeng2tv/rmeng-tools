import { useRef, useState, useEffect, useCallback } from 'react';
import DocTemplate from './DocTemplate';

// 페이지 하단 안전 여백 (이 영역에 걸치면 다음 페이지로)
const BOTTOM_MARGIN = 16;
// 2페이지 상단 여백
const PAGE2_TOP_PAD = 24;

export default function PreviewPanel({ state, currentStep, docRef }) {
  const { receiver, sender, items } = state;
  const measureRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [breakPoints, setBreakPoints] = useState([]);

  const calcBreaks = useCallback(() => {
    if (!measureRef.current) return;
    const docEl = measureRef.current.querySelector('.doc');
    if (!docEl) return;

    const docWidth = docEl.offsetWidth;
    const ph = docWidth * (297 / 210);
    const contentHeight = docEl.scrollHeight;
    setPageHeight(ph);

    if (contentHeight <= ph - BOTTOM_MARGIN) {
      setBreakPoints([]);
      return;
    }

    // 페이지 경계에서 잘리면 안 되는 요소들
    const breakables = docEl.querySelectorAll('[data-break]');
    const docTop = docEl.getBoundingClientRect().top;
    const elements = Array.from(breakables).map(el => ({
      top: el.getBoundingClientRect().top - docTop,
      bottom: el.getBoundingClientRect().bottom - docTop,
      type: el.getAttribute('data-break'),
    }));

    const breaks = [];
    let currentPageEnd = ph - BOTTOM_MARGIN;

    while (currentPageEnd < contentHeight) {
      let safeBreak = currentPageEnd;

      // 경계에 걸치는 요소 찾기 → 그 요소 시작 전으로 잘림
      for (const el of elements) {
        if (el.top < currentPageEnd && el.bottom > currentPageEnd - BOTTOM_MARGIN) {
          safeBreak = Math.min(safeBreak, el.top - 4);
        }
      }

      breaks.push(safeBreak);
      currentPageEnd = safeBreak + ph - BOTTOM_MARGIN;
    }

    setBreakPoints(breaks);
  }, []);

  useEffect(() => {
    calcBreaks();
    const timer = setTimeout(calcBreaks, 150);
    return () => clearTimeout(timer);
  });

  // 진행도 상태 텍스트
  const filled = [receiver.name, sender.name].filter(Boolean).length
    + (items.some(i => i.name) ? 1 : 0);
  const statusText =
    filled === 0 ? '입력 중...' :
    filled === 1 ? '조금 더...' :
    filled === 2 ? '절반 완성!' :
    '거의 다 됐어요!';

  const totalPages = breakPoints.length + 1;

  return (
    <div className="pvpanel">
      <div className="pvhdr">
        <span className="pvlabel">실시간 미리보기</span>
        <span className="pvst">{statusText}</span>
      </div>
      <div className="pvbody">
        {/* 숨겨진 측정용 */}
        <div ref={measureRef} style={{ position: 'absolute', left: -9999, top: 0, width: '100%', visibility: 'hidden', pointerEvents: 'none' }}>
          <DocTemplate state={state} currentStep={currentStep} />
        </div>

        {/* PDF/이미지 내보내기용 (깨끗한 단일 렌더) */}
        <div ref={docRef} style={{ position: 'absolute', left: -9999, top: 0, width: '100%', pointerEvents: 'none' }}>
          <DocTemplate state={state} currentStep={99} />
        </div>

        {/* 프리뷰 표시 */}
        {totalPages <= 1 ? (
          <div className="doc-page">
            <DocTemplate state={state} currentStep={currentStep} />
          </div>
        ) : (
          Array.from({ length: totalPages }, (_, i) => {
            const clipStart = i === 0 ? 0 : breakPoints[i - 1];
            const clipEnd = breakPoints[i] || undefined;
            const visibleHeight = clipEnd ? clipEnd - clipStart : pageHeight;

            return (
              <div key={i}>
                {i === 0 && (
                  <>
                    <div className="doc-page" style={{ height: visibleHeight, overflow: 'hidden' }}>
                      <DocTemplate state={state} currentStep={currentStep} />
                    </div>
                    <div className="page-continue">(다음 페이지에서 계속)</div>
                  </>
                )}
                {i > 0 && (
                  <>
                    <div className="page-separator">
                      <span className="page-separator-label">{i + 1}페이지</span>
                    </div>
                    <div style={{ paddingTop: PAGE2_TOP_PAD }}>
                      <div className="doc-page" style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: -clipStart }}>
                          <DocTemplate state={state} currentStep={currentStep} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
