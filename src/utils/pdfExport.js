import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// 토스 미니앱(앱인토스) 빌드 여부 — vite --mode toss 일 때 true
// 웹 빌드에선 false로 고정되어 아래 토스 분기 코드가 번들에서 자동 제거됨
const IS_TOSS = import.meta.env.MODE === 'toss';

// data URI('data:...;base64,XXXX')에서 순수 base64 부분만 추출
function dataUriToBase64(dataUri) {
  return dataUri.slice(dataUri.indexOf(',') + 1);
}

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

    const fileName = makeFileName(receiverName, 'pdf');
    if (IS_TOSS) {
      // 토스 웹뷰는 브라우저 다운로드를 막으므로 네이티브 저장 API 사용
      const { saveBase64Data } = await import('@apps-in-toss/web-framework');
      await saveBase64Data({
        data: dataUriToBase64(pdf.output('datauristring')),
        fileName,
        mimeType: 'application/pdf',
      });
    } else {
      pdf.save(fileName);
    }
  } catch (e) {
    alert('PDF 생성 오류: ' + e.message);
  }
}

export async function downloadImage(element, receiverName) {
  try {
    const canvas = await captureElement(element);
    const dataUrl = canvas.toDataURL('image/png');
    const fileName = makeFileName(receiverName, 'png');

    if (IS_TOSS) {
      // 토스 웹뷰는 브라우저 다운로드를 막으므로 네이티브 저장 API 사용
      const { saveBase64Data } = await import('@apps-in-toss/web-framework');
      await saveBase64Data({
        data: dataUriToBase64(dataUrl),
        fileName,
        mimeType: 'image/png',
      });
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    }
  } catch (e) {
    alert('이미지 생성 오류: ' + e.message);
  }
}
