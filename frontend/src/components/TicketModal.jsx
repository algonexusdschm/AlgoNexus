import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Clock, Printer, ShieldCheck, Calendar, MapPin, Sparkles, Building2, Phone, Mail, MessageSquare, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';

export default function TicketModal({ ticket, isOpen, onClose }) {
  const { eventSettings } = useEvent();
  const isPaid = ticket?.paymentStatus === 'PAID';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && isPaid) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, isPaid]);

  if (!isOpen || !ticket) return null;

  const attendeePhone = (ticket.attendee?.phone || '').replace(/[^0-9]/g, '').slice(-10);
  const attendeeEmail = ticket.attendee?.email || '';
  const attendeeName = ticket.attendee?.fullName || 'Participant';

  // Extract structured team members
  const getTeamMembersList = () => {
    const raw = ticket.attendee?.teamMembers;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(m => {
        if (typeof m === 'object' && m !== null) {
          return m.name ? `${m.role ? m.role + ': ' : ''}${m.name}` : JSON.stringify(m);
        }
        return String(m);
      }).filter(Boolean);
    }
    if (typeof raw === 'string') {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };
  const teamMembersList = getTeamMembersList();

  const handlePrint = () => {
    const qrSvg = document.getElementById('pass-qr-code')?.innerHTML || '';

    // Create a dedicated hidden iframe with 100% self-contained styling for guaranteed 1-page print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TechAstra 2026 - Delegate Pass (${ticket.ticketId})</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Chakra+Petch:wght@600;700;800&display=swap">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #ffffff;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.4;
    }
    .page-wrap {
      padding: 4mm 0;
      display: flex;
      justify-content: center;
    }
    .ticket-card {
      width: 100%;
      max-width: 650px;
      margin: 0 auto;
      padding: 22px 24px;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      background: #f8fafc;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-img {
      height: 44px;
      width: auto;
      object-fit: contain;
    }
    .title-tech {
      font-family: 'Chakra Petch', sans-serif;
      font-weight: 800;
      font-size: 19px;
      color: #0f172a;
      letter-spacing: 0.05em;
    }
    .title-tech span {
      color: #2563eb;
    }
    .dept-sub {
      font-size: 10px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-top: 2px;
    }
    .badge-status {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      border: 1px solid ${isPaid ? '#bfdbfe' : '#fde68a'};
      background: ${isPaid ? '#eff6ff' : '#fffbeb'};
      color: ${isPaid ? '#1d4ed8' : '#b45309'};
      display: inline-block;
    }
    .ticket-id {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 700;
      color: #1d4ed8;
      margin-top: 4px;
      text-align: right;
    }
    .grid-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 18px;
      margin-bottom: 14px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .field-label {
      font-size: 9px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }
    .field-val-bold {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }
    .field-val-blue {
      font-size: 13px;
      font-weight: 700;
      color: #2563eb;
    }
    .field-val-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 2px;
      word-break: break-word;
    }
    .squad-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .squad-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .members-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
    }
    .member-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #334155;
    }
    .dot-lead {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2563eb;
      flex-shrink: 0;
    }
    .dot-mem {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      flex-shrink: 0;
    }
    .note-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      color: #78350f;
    }
    .note-tag {
      font-weight: 800;
      font-size: 10px;
      background: #fef3c7;
      border: 1px solid #fcd34d;
      padding: 2px 6px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .note-text {
      font-size: 11px;
      font-weight: 600;
      line-height: 1.35;
    }
    .perforated {
      border-top: 2px dashed #cbd5e1;
      margin: 12px 0;
    }
    .footer-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2px;
    }
    .qr-info {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .qr-title {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .qr-desc {
      font-size: 11px;
      color: #334155;
      margin: 2px 0;
    }
    .qr-meta {
      font-size: 10px;
      color: #94a3b8;
    }
    .qr-box {
      background: #ffffff;
      padding: 6px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="page-wrap">
    <div class="ticket-card">
      <div class="header">
        <div class="logo-container">
          <img src="${window.location.origin}/techastra-logo.png" alt="TechAstra" class="logo-img" onerror="this.style.display='none'">
          <div>
            <div class="title-tech">TECH<span>ASTRA</span> 2026</div>
            <div class="dept-sub">DEPT OF DATA SCIENCE • SMT. CHM COLLEGE</div>
          </div>
        </div>
        <div>
          <div class="badge-status">${isPaid ? 'CONFIRMED' : 'PENDING'}</div>
          <div class="ticket-id">${ticket.ticketId}</div>
        </div>
      </div>

      <div class="grid-details">
        <div>
          <div class="field-label">ATTENDEE / LEAD</div>
          <div class="field-val-bold">${attendeeName}</div>
          <div class="field-val-sub">${ticket.attendee?.college || 'N/A'}</div>
        </div>
        <div>
          <div class="field-label">PASS TIER</div>
          <div class="field-val-blue">${ticket.passType}</div>
          <div class="field-val-sub">${ticket.attendee?.track || 'General Track'}</div>
        </div>
        <div>
          <div class="field-label">REGISTERED CONTACT</div>
          <div class="field-val-bold">${ticket.attendee?.phone || 'N/A'}</div>
          <div class="field-val-sub">${ticket.attendee?.email || ''}</div>
        </div>
        <div>
          <div class="field-label">CAMPUS VENUE & DATES</div>
          <div class="field-val-bold">${eventSettings.dates}</div>
          <div class="field-val-sub">${eventSettings.venue}</div>
        </div>
      </div>

      <div class="squad-box">
        <div class="squad-header">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">TEAM SQUAD</span>
          <span style="font-weight: 700; color: #1d4ed8; font-size: 12px;">${ticket.attendee?.teamName || 'Solo / Squad'}</span>
        </div>
        <div style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">TEAM MEMBERS:</div>
        <div class="members-grid">
          <div class="member-item">
            <span class="dot-lead"></span>
            <span style="font-weight: 700;">Leader: ${attendeeName}</span>
          </div>
          ${teamMembersList.filter(m => !m.toLowerCase().includes(attendeeName.toLowerCase())).map(m => `
            <div class="member-item">
              <span class="dot-mem"></span>
              <span>${m}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="note-box">
        <span class="note-tag">⚠️ NOTE:</span>
        <span class="note-text">Every member should carry Govt. verified ID proof and ID card provided by their college.</span>
      </div>

      <div class="perforated"></div>

      <div class="footer-section">
        <div class="qr-info">
          <div class="qr-title">OFFICIAL CHECK-IN SCANNER</div>
          <div class="qr-desc">Present at Entry Desk with College ID & Govt. ID</div>
          <div class="qr-meta">Order Ref: ${ticket.orderId || ticket.utrNumber || ticket.ticketId} • Helpline: +91 9604449724</div>
        </div>
        <div class="qr-box">
          ${qrSvg}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      try {
        iframe.contentWindow.print();
      } catch (e) {
        window.print();
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch (e) {}
      }, 1500);
    }, 400);
  };

  const shareText = `*TechAstra 2026 Official Delegate Pass*
Ticket ID: ${ticket.ticketId}
Name: ${attendeeName}
Pass: ${ticket.passType}
Event: TechAstra 2026 - Dept. of Data Science, Smt. CHM College
Status: ${isPaid ? 'CONFIRMED' : 'PENDING VERIFICATION'}
Helpline: +91 9604449724`;

  const handleCopyDetails = () => {
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all z-20 shadow-sm no-print cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner (Hidden during print) */}
        <div className="no-print">
          {isPaid ? (
            <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-6 text-white text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2.5 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-chakra font-black tracking-wide uppercase">TECHASTRA 2026 PASS CONFIRMED!</h3>
              <p className="text-xs text-sky-100 mt-1 font-mono">Payment verified. Official delegate credentials activated.</p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2.5 shadow-sm">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-chakra font-black tracking-wide uppercase">REGISTRATION & PAYMENT SUBMITTED</h3>
              <p className="text-xs text-amber-100 mt-1 font-mono">Your pass will be shared soon on your registered Email or WhatsApp number.</p>
            </div>
          )}
        </div>

        {/* Digital Ticket Card */}
        <div id="printable-ticket" className="p-4 sm:p-6 space-y-4">
          
          <div id="printable-ticket-card" className="relative p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm ticket-content-card">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/techastra-logo.png"
                  alt="TechAstra"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <div className="text-sm font-chakra font-black text-slate-900 tracking-wider">
                    TECH<span className="text-blue-600">ASTRA</span> 2026
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">DEPT OF DATA SCIENCE • SMT. CHM COLLEGE</div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                  isPaid 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {isPaid ? 'CONFIRMED' : 'PENDING'}
                </span>
                <div className="text-xs font-mono text-blue-700 mt-1 font-bold">{ticket.ticketId}</div>
              </div>
            </div>

            {/* Attendee Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-mono">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">ATTENDEE / LEAD</span>
                <span className="font-bold text-slate-900 text-sm block">{ticket.attendee?.fullName || 'N/A'}</span>
                <span className="text-[11px] text-slate-600 block truncate">{ticket.attendee?.college}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">PASS TIER</span>
                <span className="font-bold text-blue-600 text-sm block">{ticket.passType}</span>
                <span className="text-[11px] text-slate-600 block">{ticket.attendee?.track || 'General AI'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">REGISTERED CONTACT</span>
                <span className="font-semibold text-slate-800 block text-[11px]">{ticket.attendee?.phone || 'N/A'}</span>
                <span className="text-[10px] text-slate-500 block truncate">{ticket.attendee?.email}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">CAMPUS VENUE & DATES</span>
                <span className="font-semibold text-slate-800 block text-[11px]">{eventSettings.dates}</span>
                <span className="text-[10px] text-slate-500 block truncate">{eventSettings.venue}</span>
              </div>
            </div>

            {/* Team Squad & Team Members Name */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs mb-3 font-mono shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TEAM SQUAD</span>
                <span className="font-bold text-blue-700">{ticket.attendee?.teamName || 'Solo / Squad'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">TEAM MEMBERS:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="font-bold text-[11px]">Leader: {ticket.attendee?.fullName || 'N/A'}</span>
                  </div>
                  {teamMembersList.filter(m => !m.toLowerCase().includes(ticket.attendee?.fullName?.toLowerCase() || '___')).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-medium text-[11px] truncate">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory ID Proof Note (Exact user requirement) */}
            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs font-mono mb-3 flex items-start gap-2 shadow-sm">
              <span className="font-bold text-amber-700 uppercase shrink-0 text-[10px]">⚠️ NOTE:</span>
              <span className="leading-snug text-[10.5px] font-semibold">
                Every member should carry Govt. verified ID proof and ID card provided by their college.
              </span>
            </div>

            {/* Perforated separator */}
            <div className="relative flex items-center justify-between my-3">
              <div className="w-3 h-6 bg-white border-r-2 border-slate-200 -ml-6 rounded-r-full" />
              <div className="w-full border-t-2 border-dashed border-slate-200 mx-2" />
              <div className="w-3 h-6 bg-white border-l-2 border-slate-200 -mr-6 rounded-l-full" />
            </div>

            {/* QR Code and Gate Scanner section */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">OFFICIAL CHECK-IN SCANNER</span>
                <p className="text-xs text-slate-700">Present at Entry Desk with College ID & Govt. ID</p>
                <div className="text-[10px] text-slate-400">Order Ref: {ticket.orderId || ticket.utrNumber || ticket.ticketId} • Helpline: +91 9604449724</div>
              </div>

              <div id="pass-qr-code" className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                <QRCodeSVG
                  value={`https://techastra.college/verify/${ticket.ticketId}`}
                  size={72}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

          </div>

          {/* Queries & Helpline Banner (Hidden in print) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs no-print">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pass Queries & Support Desk</span>
              <span className="font-bold text-slate-800 text-sm">📞 +91 9604449724</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+919604449724"
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Helpline</span>
              </a>
              <a
                href={`https://wa.me/919604449724?text=${encodeURIComponent(`Hello, regarding TechAstra 2026 Ticket ID ${ticket.ticketId} for ${attendeeName}:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Share Bar for WhatsApp and Email (Hidden in print) */}
          <div className="flex items-center gap-2 no-print">
            {attendeePhone && (
              <a
                href={`https://wa.me/91${attendeePhone}?text=${encodeURIComponent(`Hi ${attendeeName}, here are your TechAstra 2026 registration details:\nTicket ID: ${ticket.ticketId}\nPass: ${ticket.passType}\nStatus: ${isPaid ? 'Confirmed' : 'Pending Verification'}\nHelpline: +91 9604449724`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share WhatsApp</span>
              </a>
            )}
            {attendeeEmail && (
              <a
                href={`mailto:${attendeeEmail}?subject=${encodeURIComponent(`TechAstra 2026 Pass - ${ticket.ticketId}`)}&body=${encodeURIComponent(`Hello ${attendeeName},\n\nYour TechAstra 2026 delegate pass details:\nTicket ID: ${ticket.ticketId}\nPass: ${ticket.passType}\nStatus: ${isPaid ? 'Confirmed' : 'Pending Verification'}\nVenue: Smt. Chandibai Himathmal Mansukhani College\n\nFor any queries, contact support at +91 9604449724.\n\nRegards,\nTechAstra Organizing Team`)}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Share Email</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleCopyDetails}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Copy pass details"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Action CTAs (Hidden in print) */}
          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / SAVE DELEGATE PASS (1 PAGE)</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-chakra font-bold uppercase transition-all cursor-pointer"
            >
              CLOSE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
