import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Helper to render an HTML ticket card element or generate off-screen pass
 */
export async function captureTicketElement(element) {
  if (!element) return null;
  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution for crisp printing & sharing
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#060b18',
      logging: false,
      windowWidth: 794
    });
    return canvas;
  } catch (err) {
    console.error('Error capturing ticket element:', err);
    return null;
  }
}

/**
 * Generate a 1-page A4 Portrait PDF Blob from a canvas
 */
export function createPassPdfFromCanvas(canvas, ticketId = 'TechAstra-Pass') {
  if (!canvas) return null;
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fill page background with dark cyber theme
    pdf.setFillColor(6, 11, 24);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Calculate dimensions to fit neatly on portrait A4
    const cardWidth = 155; // mm
    const cardHeight = (canvas.height * cardWidth) / canvas.width;
    const x = (pageWidth - cardWidth) / 2;
    const y = Math.max(12, (pageHeight - cardHeight) / 2);

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight, undefined, 'FAST');

    // Footer branding
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(8);
    pdf.text(
      'TechAstra 2026 • Official Delegate Credentials • Department of Data Science, Smt. CHM College',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    const pdfBlob = pdf.output('blob');
    return {
      pdf,
      blob: pdfBlob,
      filename: `${ticketId}-Official-Pass.pdf`
    };
  } catch (err) {
    console.error('Error creating PDF from canvas:', err);
    return null;
  }
}

/**
 * Share pass PDF directly via Web Share API or download & open WhatsApp fallback
 */
export async function sharePassPdfDirectly(element, ticket) {
  const ticketId = ticket?.ticketId || 'TECH26-PASS';
  const attendeeName = ticket?.attendee?.fullName || 'Participant';
  const phone = (ticket?.attendee?.phone || '').replace(/[^0-9]/g, '').slice(-10);

  // 1. Capture the visual pass card
  const canvas = await captureTicketElement(element);
  if (!canvas) {
    alert('Could not render pass for sharing. Please try the print/download option.');
    return { success: false };
  }

  // 2. Generate PDF
  const pdfData = createPassPdfFromCanvas(canvas, ticketId);
  if (!pdfData) {
    alert('Could not generate PDF pass. Please try again.');
    return { success: false };
  }

  const { blob, filename, pdf } = pdfData;
  const pdfFile = new File([blob], filename, { type: 'application/pdf' });

  const shareText = `🎟️ TechAstra 2026 Official Delegate Pass\nParticipant: ${attendeeName}\nTicket ID: ${ticketId}\nStatus: VERIFIED / CONFIRMED\nVenue: Smt. CHM College Campus\nHelpline: +91 9604449724`;

  // 3. Check if native Web Share with file attachment is supported (Mobile / Chrome / Safari)
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: `TechAstra 2026 Pass - ${ticketId}`,
        text: shareText
      });
      return { success: true, method: 'native-share' };
    } catch (shareErr) {
      if (shareErr.name === 'AbortError') {
        // User cancelled the share dialog
        return { success: false, cancelled: true };
      }
      console.warn('Native share error, falling back:', shareErr);
    }
  }

  // 4. Fallback for Desktop or browsers without native file share:
  // Download the PDF file directly
  pdf.save(filename);

  // If a phone number exists, also offer to open WhatsApp
  if (phone) {
    const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(
      `🎉 Hello ${attendeeName}!\nYour TechAstra 2026 Pass (${ticketId}) is VERIFIED & APPROVED! ✅\n\nYour official PDF pass has been generated. You can also view and verify your pass live anytime here:\nhttps://algonexus.tech/verify/${ticketId}\n\nSee you at the Hackathon! 🚀\n— Department of Data Science, Smt. CHM College`
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  return { success: true, method: 'download-and-whatsapp' };
}

/**
 * Share pass Image (PNG card) directly via Web Share API
 */
export async function sharePassImageDirectly(element, ticket) {
  const ticketId = ticket?.ticketId || 'TECH26-PASS';
  const attendeeName = ticket?.attendee?.fullName || 'Participant';
  const phone = (ticket?.attendee?.phone || '').replace(/[^0-9]/g, '').slice(-10);

  const canvas = await captureTicketElement(element);
  if (!canvas) return { success: false };

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve({ success: false });
        return;
      }
      const filename = `${ticketId}-Pass-Card.png`;
      const imgFile = new File([blob], filename, { type: 'image/png' });

      const shareText = `🎟️ TechAstra 2026 Pass • ${attendeeName} (${ticketId}) • VERIFIED ✅`;

      if (navigator.canShare && navigator.canShare({ files: [imgFile] })) {
        try {
          await navigator.share({
            files: [imgFile],
            title: `TechAstra 2026 Pass - ${ticketId}`,
            text: shareText
          });
          resolve({ success: true, method: 'native-share-image' });
          return;
        } catch (err) {
          if (err.name === 'AbortError') {
            resolve({ success: false, cancelled: true });
            return;
          }
        }
      }

      // Fallback: download image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (phone) {
        const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(
          `Hi ${attendeeName}, here are your TechAstra 2026 Pass credentials:\nTicket ID: ${ticketId}\nStatus: VERIFIED\nVerify online: https://algonexus.tech/verify/${ticketId}`
        )}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
      resolve({ success: true, method: 'download-and-whatsapp' });
    }, 'image/png');
  });
}
