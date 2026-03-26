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
 * 요소를 복제 → 화면에 임시 배치 → 캡처 → 제거
 */
async function captureElement(element) {
  const clone = element.cloneNode(true);
  clone.style.cssText = 'position: fixed; top: 0; left: 0; width: 400px; z-index: 99999; background: #fff; pointer-events: none;';
  document.body.appendChild(clone);

  await new Promise(r => setTimeout(r, 300));

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  document.body.removeChild(clone);
  return canvas;
}

/**
 * PDF 다운로드
 */
export async function downloadPDF(element, receiverName) {
  const canvas = await captureElement(element);

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = 297;

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
