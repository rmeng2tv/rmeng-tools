import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function makeFileName(receiverName, ext) {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const name = (receiverName || '견적서').replace(/[\/\\:*?"<>|]/g, '_');
  return `견적서_${name}_${date}.${ext}`;
}

/**
 * 화면에 보이는 .doc 요소를 찾아서 복제 → 캡처 → 제거
 */
async function captureDoc() {
  // 프리뷰에서 보이는 .doc 요소 찾기 (전체 내용 포함)
  const sourceDoc = document.querySelector('.pvbody .doc');
  if (!sourceDoc) throw new Error('문서를 찾을 수 없습니다');

  // 복제해서 body에 임시 배치
  const clone = sourceDoc.cloneNode(true);
  clone.style.cssText = 'position: absolute; top: 0; left: 0; width: 380px; z-index: 99999; background: #fff; overflow: visible; max-height: none; height: auto;';

  // 블러 해제 (캡처용)
  const bwrap = clone.querySelector('.bwrap');
  if (bwrap) {
    bwrap.classList.remove('blurred');
    bwrap.classList.add('clear');
  }

  document.body.appendChild(clone);
  await new Promise(r => setTimeout(r, 300));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    return canvas;
  } finally {
    document.body.removeChild(clone);
  }
}

/**
 * PDF 다운로드
 */
export async function downloadPDF(element, receiverName) {
  try {
    const canvas = await captureDoc();

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
    alert('PDF 생성 중 오류가 발생했습니다: ' + e.message);
  }
}

/**
 * 이미지(PNG) 다운로드
 */
export async function downloadImage(element, receiverName) {
  try {
    const canvas = await captureDoc();
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = makeFileName(receiverName, 'png');
    link.href = dataUrl;
    link.click();
  } catch (e) {
    alert('이미지 생성 중 오류가 발생했습니다: ' + e.message);
  }
}
