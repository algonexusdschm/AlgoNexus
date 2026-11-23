import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Clock, Printer, ShieldCheck, Calendar, MapPin, Sparkles, Building2, Phone, Mail, MessageSquare, Share2, Copy, Check, QrCode } from 'lucide-react';
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
    // 1. Get the QR code SVG element
    const qrSvgElement = document.getElementById('pass-qr-code');
    const qrSvg = qrSvgElement ? qrSvgElement.innerHTML : '';

    // 2. Manage reusable dedicated print iframe (never delete mid-print)
    const printFrameId = 'techaastra-portrait-pass-frame';
    let iframe = document.getElementById(printFrameId);
    if (iframe) {
      try {
        iframe.remove();
      } catch (e) {}
    }

    iframe = document.createElement('iframe');
    iframe.id = printFrameId;
    iframe.setAttribute('title', 'TechAstra 2026 Pass Print');
    // Important: Render with proper physical dimensions off-screen so Chromium layout engine computes styles properly
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TechAstra 2026 - Delegate Pass (${ticket.ticketId})</title>
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
      color-adjust: exact !important;
    }
    html, body {
      width: 100%;
      height: auto;
      margin: 0;
      padding: 0;
      background: #030712 !important;
      color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      line-height: 1.35;
    }
    .page-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 4mm 0;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .portrait-badge {
      width: 100%;
      max-width: 410px;
      margin: 0 auto;
      padding: 20px 18px;
      background: #0b1329 !important;
      background: linear-gradient(180deg, #0b1329 0%, #060b18 100%) !important;
      border: 2px solid #0284c7 !important;
      border-radius: 18px;
      position: relative;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      box-shadow: 0 0 25px rgba(2, 132, 199, 0.35);
    }
    .lanyard-slot {
      width: 46px;
      height: 6px;
      background: #1e293b !important;
      border: 1px solid #38bdf8 !important;
      border-radius: 9999px;
      margin: 0 auto 12px auto;
    }
    .badge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }
    .title-tech {
      font-weight: 900;
      font-size: 17px;
      color: #ffffff;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .title-tech span {
      color: #38bdf8;
    }
    .dept-sub {
      font-size: 8.5px;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-top: 2px;
      letter-spacing: 0.03em;
    }
    .status-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9.5px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 9999px;
      text-transform: uppercase;
      border: 1px solid ${isPaid ? '#059669' : '#d97706'} !important;
      background: ${isPaid ? '#022c22' : '#451a03'} !important;
      color: ${isPaid ? '#34d399' : '#fbbf24'} !important;
      display: inline-block;
    }
    .ticket-id {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 4px;
      text-align: right;
      letter-spacing: 0.05em;
    }
    .details-box {
      background: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 12px;
      padding: 10px 12px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .field-label {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 2px;
    }
    .field-val-white {
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      word-break: break-word;
    }
    .field-val-cyan {
      font-size: 11px;
      font-weight: 800;
      color: #38bdf8;
    }
    .field-val-sub {
      font-size: 9.5px;
      color: #94a3b8;
      margin-top: 1px;
      word-break: break-word;
    }
    .squad-panel {
      background: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 12px;
      padding: 9px 12px;
      margin-bottom: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .squad-top {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .members-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 8px;
    }
    .member-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      color: #cbd5e1;
    }
    .dot-lead {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #38bdf8 !important;
      box-shadow: 0 0 6px #38bdf8;
      flex-shrink: 0;
    }
    .dot-mem {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #64748b !important;
      flex-shrink: 0;
    }
    .warning-box {
      background: #451a03 !important;
      border: 1px solid #f59e0b !important;
      border-radius: 10px;
      padding: 7px 10px;
      margin-bottom: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      display: flex;
      gap: 6px;
      align-items: flex-start;
      color: #fde68a !important;
    }
    .warning-tag {
      font-weight: 800;
      font-size: 8.5px;
      background: rgba(245, 158, 11, 0.25) !important;
      border: 1px solid #f59e0b !important;
      padding: 1px 4px;
      border-radius: 3px;
      flex-shrink: 0;
      color: #fbbf24 !important;
    }
    .warning-text {
      font-size: 9.5px;
      font-weight: 600;
      line-height: 1.35;
    }
    .conduit-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, #0284c7, #38bdf8, #0284c7, transparent) !important;
      box-shadow: 0 0 6px #38bdf8;
      margin: 10px 0;
    }
    .badge-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2px;
      gap: 10px;
    }
    .qr-info {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      flex: 1;
    }
    .qr-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pass-num-bold {
      font-size: 14px;
      font-weight: 900;
      color: #38bdf8;
      letter-spacing: 0.06em;
      margin: 2px 0;
    }
    .qr-desc {
      font-size: 9.5px;
      color: #94a3b8;
      margin: 2px 0;
      line-height: 1.3;
    }
    .qr-meta {
      font-size: 8.5px;
      color: #64748b;
      margin-top: 3px;
    }
    .qr-container {
      background: #ffffff !important;
      padding: 5px;
      border-radius: 10px;
      border: 2px solid #38bdf8 !important;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
    }
    .qr-container svg {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  </style>
</head>
<body>
  <div class="page-wrap">
    <div class="portrait-badge">
      
      <!-- Top Lanyard Slot -->
      <div class="lanyard-slot"></div>

      <!-- Header with TechAstra Emblem -->
      <div class="badge-header">
        <div class="logo-container">
          <img src="${window.location.origin}/techastra-logo.png" alt="TechAstra" class="logo-img" onerror="this.style.display='none'">
          <div>
            <div class="title-tech">TECH<span>ASTRA</span> 2026</div>
            <div class="dept-sub">DEPT OF DATA SCIENCE • SMT. CHM COLLEGE</div>
          </div>
        </div>
        <div>
          <div class="status-badge">${isPaid ? 'CONFIRMED' : 'PENDING'}</div>
          <div class="ticket-id">${ticket.ticketId}</div>
        </div>
      </div>

      <!-- Attendee & Pass Details Grid -->
      <div class="details-box">
        <div>
          <div class="field-label">ATTENDEE / LEAD</div>
          <div class="field-val-white">${attendeeName}</div>
          <div class="field-val-sub">${ticket.attendee?.college || 'N/A'}</div>
        </div>
        <div>
          <div class="field-label">PASS TIER</div>
          <div class="field-val-cyan">${ticket.passType}</div>
          <div class="field-val-sub">${ticket.attendee?.track || 'General AI/Hack'}</div>
        </div>
        <div>
          <div class="field-label">REGISTERED CONTACT</div>
          <div class="field-val-white">${ticket.attendee?.phone || 'N/A'}</div>
          <div class="field-val-sub">${ticket.attendee?.email || ''}</div>
        </div>
        <div>
          <div class="field-label">CAMPUS VENUE & DATES</div>
          <div class="field-val-white">${eventSettings.dates}</div>
          <div class="field-val-sub">${eventSettings.venue}</div>
        </div>
      </div>

      <!-- Team Squad Box -->
      <div class="squad-panel">
        <div class="squad-top">
          <span style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">TEAM SQUAD</span>
          <span style="font-weight: 700; color: #38bdf8; font-size: 10.5px;">${ticket.attendee?.teamName || 'Solo / Squad'}</span>
        </div>
        <div style="font-size: 8px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">TEAM MEMBERS:</div>
        <div class="members-grid">
          <div class="member-item">
            <span class="dot-lead"></span>
            <span style="font-weight: 700; color: #ffffff;">Leader: ${attendeeName}</span>
          </div>
          ${teamMembersList.filter(m => !m.toLowerCase().includes(attendeeName.toLowerCase())).map(m => `
            <div class="member-item">
              <span class="dot-mem"></span>
              <span>${m}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Mandatory Govt & College ID Warning -->
      <div class="warning-box">
        <span class="warning-tag">⚠️ NOTE:</span>
        <span class="warning-text">Every member should carry Govt. verified ID proof and ID card provided by their college.</span>
      </div>

      <!-- Cyber Conduit Divider -->
      <div class="conduit-line"></div>

      <!-- Unique Pass Number & High-Contrast Security QR Code -->
      <div class="badge-footer">
        <div class="qr-info">
          <div class="qr-title">UNIQUE PASS NUMBER</div>
          <div class="pass-num-bold">${ticket.ticketId}</div>
          <div class="qr-desc">Present this Unique Pass Number at the entry gate desk with College & Govt ID.</div>
          <div class="qr-meta">Order Ref: ${ticket.orderId || ticket.utrNumber || ticket.ticketId} • Helpline: +91 9604449724</div>
        </div>
        <div class="qr-container">
          ${qrSvg || `<div style="font-size: 8px; font-weight: bold; color: #0284c7; text-align: center; padding: 4px;">${ticket.ticketId}</div>`}
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Trigger print once document is ready; DO NOT remove iframe to avoid breaking Chrome print preview!
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.warn('Iframe print failed, falling back to window.print():', e);
        window.print();
      }
    }, 450);
  };

  const shareText = `*TechAstra 2026 Official Delegate Pass*
Unique Pass Number: ${ticket.ticketId}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all z-20 shadow-sm no-print cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner (Hidden during print) */}
        <div className="no-print">
          {isPaid ? (
            <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-5 text-white text-center">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-chakra font-black tracking-wide uppercase">TECHASTRA 2026 PASS CONFIRMED!</h3>
              <p className="text-[11px] text-sky-100 mt-0.5 font-mono">Payment verified. Official delegate credentials activated.</p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white text-center">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2 shadow-sm">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-chakra font-black tracking-wide uppercase">REGISTRATION & PAYMENT SUBMITTED</h3>
              <p className="text-[11px] text-amber-100 mt-0.5 font-mono">Your pass will be shared soon on your registered Email or WhatsApp number.</p>
            </div>
          )}
        </div>

        {/* Digital Ticket Card (TechAstra Cyber Dark Portrait) */}
        <div id="printable-ticket" className="p-4 sm:p-5 space-y-4">
          
          <div id="printable-ticket-card" className="relative p-5 rounded-2xl bg-gradient-to-b from-[#0b1329] to-[#060b18] border-2 border-sky-500/50 shadow-[0_0_25px_rgba(2,132,199,0.25)] ticket-content-card">
            
            {/* Top Lanyard Slot for Badge Portrait Look */}
            <div className="w-12 h-1.5 bg-slate-800 border border-sky-400/50 rounded-full mx-auto mb-3" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/techastra-logo.png"
                  alt="TechAstra"
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <div className="text-sm font-chakra font-black text-white tracking-wider">
                    TECH<span className="text-sky-400">ASTRA</span> 2026
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">DEPT OF DATA SCIENCE • SMT. CHM COLLEGE</div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isPaid 
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' 
                    : 'bg-amber-950/80 text-amber-400 border-amber-500/50'
                }`}>
                  {isPaid ? 'CONFIRMED' : 'PENDING'}
                </span>
                <div className="text-xs font-mono text-sky-400 mt-1 font-extrabold tracking-wider">{ticket.ticketId}</div>
              </div>
            </div>

            {/* Attendee Details Grid */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-2.5 text-xs mb-3 font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">ATTENDEE / LEAD</span>
                <span className="font-extrabold text-white text-xs block">{ticket.attendee?.fullName || 'N/A'}</span>
                <span className="text-[10px] text-slate-400 block truncate">{ticket.attendee?.college}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">PASS TIER</span>
                <span className="font-extrabold text-sky-400 text-xs block">{ticket.passType}</span>
                <span className="text-[10px] text-slate-400 block">{ticket.attendee?.track || 'General AI'}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">REGISTERED CONTACT</span>
                <span className="font-medium text-slate-200 block text-[11px]">{ticket.attendee?.phone || 'N/A'}</span>
                <span className="text-[9.5px] text-slate-400 block truncate">{ticket.attendee?.email}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">CAMPUS VENUE & DATES</span>
                <span className="font-medium text-slate-200 block text-[11px]">{eventSettings.dates}</span>
                <span className="text-[9.5px] text-slate-400 block truncate">{eventSettings.venue}</span>
              </div>
            </div>

            {/* Team Squad & Team Members Name */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs mb-3 font-mono shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TEAM SQUAD</span>
                <span className="font-bold text-sky-400 text-[11px]">{ticket.attendee?.teamName || 'Solo / Squad'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block">TEAM MEMBERS:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-0.5">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] shrink-0" />
                    <span className="font-bold text-[10.5px]">Leader: {ticket.attendee?.fullName || 'N/A'}</span>
                  </div>
                  {teamMembersList.filter(m => !m.toLowerCase().includes(ticket.attendee?.fullName?.toLowerCase() || '___')).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                      <span className="font-medium text-[10.5px] truncate">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory ID Proof Note */}
            <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs font-mono mb-3 flex items-start gap-2 shadow-sm">
              <span className="font-bold text-amber-400 uppercase shrink-0 text-[9px] bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-500/40">⚠️ NOTE:</span>
              <span className="leading-snug text-[10px] font-semibold text-amber-200">
                Every member should carry Govt. verified ID proof and ID card provided by their college.
              </span>
            </div>

            {/* Glowing Cyber Conduit separator */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent shadow-[0_0_8px_#38bdf8] my-3" />

            {/* Unique Pass Number & Gate Entry Desk Section */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 font-mono">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">UNIQUE PASS NUMBER</span>
                <div className="text-base font-extrabold text-sky-400 tracking-wider font-mono text-shadow-[0_0_10px_#38bdf8]">{ticket.ticketId}</div>
                <p className="text-[10px] text-slate-300">Present this Unique Pass Number at the entry gate desk with College & Govt ID</p>
                <div className="text-[9.5px] text-slate-500">Order Ref: {ticket.orderId || ticket.utrNumber || ticket.ticketId} • Helpline: +91 9604449724</div>
              </div>

              <div id="pass-qr-code" className="p-2 bg-white rounded-xl border-2 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.35)] shrink-0">
                <QRCodeSVG
                  value={`https://techastra.college/verify/${ticket.ticketId}`}
                  size={68}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

          </div>

          {/* Queries & Helpline Banner (Hidden in print) */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs no-print">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Pass Queries & Support Desk</span>
              <span className="font-bold text-sky-400 text-xs">📞 +91 9604449724</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+919604449724"
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
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
                href={`https://wa.me/91${attendeePhone}?text=${encodeURIComponent(`Hi ${attendeeName}, here are your TechAstra 2026 registration details:\nUnique Pass Number: ${ticket.ticketId}\nPass: ${ticket.passType}\nStatus: ${isPaid ? 'Confirmed' : 'Pending Verification'}\nHelpline: +91 9604449724`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share WhatsApp</span>
              </a>
            )}
            {attendeeEmail && (
              <a
                href={`mailto:${attendeeEmail}?subject=${encodeURIComponent(`TechAstra 2026 Pass - ${ticket.ticketId}`)}&body=${encodeURIComponent(`Hello ${attendeeName},\n\nYour TechAstra 2026 delegate pass details:\nUnique Pass Number: ${ticket.ticketId}\nPass: ${ticket.passType}\nStatus: ${isPaid ? 'Confirmed' : 'Pending Verification'}\nVenue: Smt. Chandibai Himathmal Mansukhani College\n\nFor any queries, contact support at +91 9604449724.\n\nRegards,\nTechAstra Organizing Team`)}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Share Email</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleCopyDetails}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Copy pass details"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
              <span>PRINT / SAVE DELEGATE PASS (1 PAGE PORTRAIT)</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-chakra font-bold uppercase transition-all cursor-pointer"
            >
              CLOSE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
