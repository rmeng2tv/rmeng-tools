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
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });
  return canvas;
}

// .sa/.sb/.sc 카드 = 분할 알고리즘이 만든 페이지 단위.
// measureLayer는 left: -9999로 화면 밖에 있으므로 boundingClientRect로 걸러냄.
function findPageCards(element) {
  const all = element.querySelectorAll('.sa, .sb, .sc');
  return Array.from(all).filter(card => card.getBoundingClientRect().left >= 0);
}

export async function downloadPDF(element, receiverName) {
  try {
    const cards = findPageCards(element);
    if (cards.length === 0) {
      alert('PDF 생성 오류: 견적서 카드를 찾을 수 없습니다.');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const A4_W = 210;
    const A4_H = 297;

    for (let i = 0; i < cards.length; i++) {
      const canvas = await html2canvas(cards[i], {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, A4_W, A4_H);
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
