import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Returns dynamic live URL for a pass on current website
 */
export function getPassLiveUrl(ticketId) {
  const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : '';
  const cleanId = String(ticketId || '').trim();
  return `${origin}/?pass=${encodeURIComponent(cleanId)}#pass`;
}

/**
 * Helper to render an HTML ticket card element to high-res canvas (White Studio Theme)
 */
export async function captureTicketElement(element) {
  if (!element) return null;
  try {
    const canvas = await html2canvas(element, {
      scale: 2.2, // Crisp 300DPI-equivalent resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    return canvas;
  } catch (err) {
    console.error('Error capturing ticket element:', err);
    return null;
  }
}

/**
 * Generate a 1-page A4 Portrait PDF from canvas (White Studio Theme)
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

    // Clean white studio page background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Calculate dimensions to fit neatly in center of portrait A4
    const cardWidth = 158; // mm
    const cardHeight = (canvas.height * cardWidth) / canvas.width;
    const x = (pageWidth - cardWidth) / 2;
    const y = Math.max(12, (pageHeight - cardHeight) / 2 - 4);

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight, undefined, 'FAST');

    // Clean footer credentials
    pdf.setTextColor(100, 116, 139);
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
 * Download the official PDF pass directly to the device
 */
export async function downloadPassPdf(element, ticket) {
  const ticketId = ticket?.ticketId || 'TECH26-PASS';
  const canvas = await captureTicketElement(element);
  if (!canvas) {
    window.print();
    return;
  }
  const pdfData = createPassPdfFromCanvas(canvas, ticketId);
  if (pdfData && pdfData.pdf) {
    pdfData.pdf.save(pdfData.filename);
    return true;
  }
  return false;
}

/**
 * 1-CLICK DIRECT WHATSAPP SEND: Opens the exact attendee's chat with prefilled message
 * NO SEARCHING REQUIRED!
 */
export async function sendDirectToAttendeeWhatsApp(ticket, element = null) {
  const ticketId = ticket?.ticketId || ticket?.id || 'TECH26-PASS';
  const attendeeName = ticket?.attendee?.fullName || 'Participant';
  const teamName = ticket?.attendee?.teamName || 'Hackathon Squad';
  const passType = ticket?.passType || 'Hackathon Squad Pass';
  const rawPhone = ticket?.attendee?.phone || '';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '').slice(-10);
  const liveUrl = getPassLiveUrl(ticketId);

  // If element is available, also trigger quick background PDF download so the organizer has the file ready in 1 click
  if (element) {
    try {
      const canvas = await captureTicketElement(element);
      if (canvas) {
        const pdfData = createPassPdfFromCanvas(canvas, ticketId);
        if (pdfData?.pdf) {
          pdfData.pdf.save(pdfData.filename);
        }
      }
    } catch (e) {
      console.warn('Background PDF save notice:', e);
    }
  }

  const message = `🎉 *Congratulations, ${attendeeName}!*
Your registration & payment for *TechAstra 2026* has been *VERIFIED & APPROVED*! ✅

🎟️ *OFFICIAL DELEGATE PASS:*
• *Pass ID:* ${ticketId}
• *Team Name:* ${teamName}
• *Lead Attendee:* ${attendeeName}
• *Pass Tier:* ${passType}
• *Status:* VERIFIED & CONFIRMED

👉 *VIEW & VERIFY YOUR LIVE PASS:*
${liveUrl}

*(Tap the link above to view your digital pass card and download your official PDF)*

📍 *Venue:* Auditorium & Tech Hub, Smt. CHM College Campus, Ulhasnagar
📞 *Queries & Helpline:* +91 9604449724

See you at the Hackathon! 🚀
— Department of Data Science, Smt. Chandibai Himathmal Mansukhani College`;

  if (cleanPhone && cleanPhone.length === 10) {
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return { success: true, method: 'direct-chat', phone: cleanPhone };
  } else {
    // If no phone on file, open WhatsApp web share
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return { success: true, method: 'generic-chat' };
  }
}

/**
 * Native OS Share Sheet (For users who explicitly want to share the raw PDF file to other apps)
 */
export async function sharePassPdfViaNativeSheet(element, ticket) {
  const ticketId = ticket?.ticketId || 'TECH26-PASS';
  const attendeeName = ticket?.attendee?.fullName || 'Participant';
  const canvas = await captureTicketElement(element);
  if (!canvas) return { success: false };

  const pdfData = createPassPdfFromCanvas(canvas, ticketId);
  if (!pdfData) return { success: false };

  const { blob, filename, pdf } = pdfData;
  const pdfFile = new File([blob], filename, { type: 'application/pdf' });
  const liveUrl = getPassLiveUrl(ticketId);

  const shareText = `🎟️ TechAstra 2026 Pass • ${attendeeName} (${ticketId}) • VERIFIED ✅\nLive Pass: ${liveUrl}`;

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: `TechAstra 2026 Pass - ${ticketId}`,
        text: shareText
      });
      return { success: true, method: 'native-share' };
    } catch (shareErr) {
      if (shareErr.name === 'AbortError') return { success: false, cancelled: true };
    }
  }

  // Fallback: download PDF
  pdf.save(filename);
  return { success: true, method: 'downloaded' };
}
