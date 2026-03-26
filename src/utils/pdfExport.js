import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * 파일명 생성
 */
function makeFileName(receiverName, ext) {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const name = (receiverName || '견적서').replace(/[\/\\:*?"<>|]/g, '_');
  return `견적서_${name}_${date}.${ext}`;
}

/**
 * 캡처 전 요소를 화면에 임시 표시 → 캡처 → 다시 숨김
 */
async function captureElement(element) {
  // 원래 스타일 저장
  const origStyle = element.style.cssText;

  // 캡처를 위해 화면에 임시 배치
  element.style.cssText = 'position: fixed; top: 0; left: 0; width: 400px; z-index: -1; opacity: 1; pointer-events: none;';

  // 렌더링 대기
  await new Promise(r => setTimeout(r, 100));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 400,
  });

  // 원래 스타일 복원 (다시 숨김)
  element.style.cssText = origStyle;

  return canvas;
}

/**
 * PDF 다운로드
 */
export async function downloadPDF(element, receiverName) {
  const canvas = await captureElement(element);

  const imgWidth = 210; // A4 가로 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = 297; // A4 세로 mm

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  let position = 0;
  let remaining = imgHeight;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

  while (remaining > pageHeight) {
    remaining -= pageHeight;
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  }

  pdf.save(makeFileName(receiverName, 'pdf'));
}

/**
 * 이미지(PNG) 다운로드
 */
export async function downloadImage(element, receiverName) {
  const canvas = await captureElement(element);
  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = makeFileName(receiverName, 'png');
  link.href = dataUrl;
  link.click();
}
