import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function makeFileName(receiverName, ext) {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const name = (receiverName || '견적서').replace(/[\/\\:*?"<>|]/g, '_');
  return `견적서_${name}_${date}.${ext}`;
}

/**
 * ref로 전달받은 실제 화면에 표시된 요소를 캡처
 */
async function captureElement(element) {
  // 디버그: 요소 크기 확인
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  if (!w || !h) {
    throw new Error(`요소 크기가 0입니다: ${w}x${h}`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: true,
    allowTaint: true,
  });

  // 디버그: 캔버스 크기 확인
  if (!canvas.width || !canvas.height) {
    throw new Error(`캔버스 크기가 0입니다: ${canvas.width}x${canvas.height}`);
  }

  alert(`캡처 성공: 요소 ${w}x${h} → 캔버스 ${canvas.width}x${canvas.height}`);
  return canvas;
}

export async function downloadPDF(element, receiverName) {
  try {
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
  } catch (e) {
    alert('PDF 생성 오류: ' + e.message);
  }
}

export async function downloadImage(element, receiverName) {
  try {
    const canvas = await captureElement(element);
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = makeFileName(receiverName, 'png');
    link.href = dataUrl;
    link.click();
  } catch (e) {
    alert('이미지 생성 오류: ' + e.message);
  }
}
