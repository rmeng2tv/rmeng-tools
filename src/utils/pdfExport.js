import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * 파일명 생성
 * @param {string} receiverName - 수신 업체명
 * @param {string} ext - 확장자 ('pdf' | 'png')
 */
function makeFileName(receiverName, ext) {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const name = (receiverName || '견적서').replace(/[\/\\:*?"<>|]/g, '_');
  return `견적서_${name}_${date}.${ext}`;
}

/**
 * 프리뷰 영역을 Canvas로 캡처
 * @param {HTMLElement} element - 캡처할 DOM 요소
 * @returns {Promise<HTMLCanvasElement>}
 */
async function captureElement(element) {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
  });
}

/**
 * PDF 다운로드
 * @param {HTMLElement} element - 캡처할 DOM 요소 (.doc 클래스)
 * @param {string} receiverName - 수신 업체명 (파일명용)
 */
export async function downloadPDF(element, receiverName) {
  const canvas = await captureElement(element);

  const imgWidth = 210; // A4 가로 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = 297; // A4 세로 mm

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  // 한 페이지에 들어가면 그대로, 넘치면 여러 페이지
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
 * @param {HTMLElement} element - 캡처할 DOM 요소 (.doc 클래스)
 * @param {string} receiverName - 수신 업체명 (파일명용)
 */
export async function downloadImage(element, receiverName) {
  const canvas = await captureElement(element);
  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = makeFileName(receiverName, 'png');
  link.href = dataUrl;
  link.click();
}
