import React, { useEffect, useState } from 'react';
import { 
  X, CheckCircle2, Clock, Printer, Calendar, MapPin, Sparkles, 
  Building2, Phone, Mail, MessageSquare, Share2, Copy, Check, 
  Download, Loader2, Image as ImageIcon, ArrowUpRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';
import { 
  getPassLiveUrl, 
  sendDirectToAttendeeWhatsApp, 
  downloadPassPdf, 
  sharePassPdfViaNativeSheet 
} from '../utils/passShare';

export default function TicketModal({ ticket, isOpen, onClose }) {
  const { eventSettings } = useEvent();
  const isPaid = ticket?.paymentStatus === 'PAID';
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

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
  const livePassUrl = getPassLiveUrl(ticket.ticketId);

  // Extract structured team members list
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

  // 1-Click Direct WhatsApp Share (Straight to attendee chat, ZERO searching)
  const handleDirectWhatsApp = async () => {
    setIsProcessing(true);
    setProcessStatus('Opening chat & preparing pass...');
    try {
      const cardEl = document.getElementById('printable-ticket-card');
      await sendDirectToAttendeeWhatsApp(ticket, cardEl);
    } catch (err) {
      console.error('WhatsApp direct error:', err);
    } finally {
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  // Direct High-Res PDF Download (A4 Portrait)
  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    setProcessStatus('Generating high-res PDF...');
    try {
      const cardEl = document.getElementById('printable-ticket-card');
      await downloadPassPdf(cardEl, ticket);
    } catch (err) {
      console.error('Download PDF error:', err);
    } finally {
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  // Share via Other Apps (OS Share Sheet)
  const handleNativeShare = async () => {
    setIsProcessing(true);
    setProcessStatus('Opening share tray...');
    try {
      const cardEl = document.getElementById('printable-ticket-card');
      await sharePassPdfViaNativeSheet(cardEl, ticket);
    } catch (err) {
      console.error('Native share error:', err);
    } finally {
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  const handleCopyDetails = () => {
    const text = `🎉 TechAstra 2026 Official Delegate Pass
Participant: ${attendeeName}
Pass ID: ${ticket.ticketId}
Tier: ${ticket.passType}
Status: ${isPaid ? 'VERIFIED & CONFIRMED' : 'PENDING VERIFICATION'}
Live Pass Link: ${livePassUrl}
Venue: Smt. Chandibai Himathmal Mansukhani College, Ulhasnagar
Helpline: +91 9604449724`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 text-slate-900 flex flex-col max-h-[94vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all z-20 shadow-sm no-print cursor-pointer"
          title="Close pass view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner */}
        <div className="no-print">
          {isPaid ? (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-4 text-white text-center">
              <div className="w-9 h-9 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1.5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-chakra font-black tracking-wide uppercase">TECHASTRA 2026 PASS CONFIRMED!</h3>
              <p className="text-[11px] text-sky-100 font-mono">Payment verified. Official delegate credentials activated.</p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white text-center">
              <div className="w-9 h-9 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1.5 shadow-sm">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-chakra font-black tracking-wide uppercase">REGISTRATION & PAYMENT SUBMITTED</h3>
              <p className="text-[11px] text-amber-100 font-mono">Awaiting verification by the organizing committee.</p>
            </div>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* DIGITAL TICKET CARD - WHITE STUDIO THEME (HIGH RESOLUTION & NO TEXT CLIPPING) */}
          <div
            id="printable-ticket-card"
            className="relative p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-lg text-slate-900 ticket-content-card"
            style={{ width: '100%', boxSizing: 'border-box' }}
          >
            {/* Top Lanyard Slot for Official Badge Portrait Look */}
            <div className="w-14 h-2 bg-slate-200 border border-slate-300 rounded-full mx-auto mb-4" />

            {/* Header: Logo, Branding & Ticket ID */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/techastra-logo.png"
                  alt="TechAstra"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div>
                  <div className="text-base font-chakra font-black text-slate-900 tracking-wider flex items-center gap-1.5">
                    <span>TECH<span className="text-blue-600">ASTRA</span> 2026</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono font-semibold uppercase leading-tight">
                    DEPT OF DATA SCIENCE • SMT. CHM COLLEGE
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isPaid 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {isPaid ? 'CONFIRMED' : 'PENDING'}
                </span>
                <div className="text-sm font-mono text-blue-600 mt-1 font-black tracking-wider">
                  {ticket.ticketId}
                </div>
              </div>
            </div>

            {/* Attendee Details Grid - Spacious, Readable, NO cut-offs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono mb-4 leading-normal">
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-bold">ATTENDEE / LEAD</span>
                <span className="font-extrabold text-slate-900 text-sm block leading-snug">{ticket.attendee?.fullName || 'N/A'}</span>
                <span className="text-[11px] text-slate-600 block leading-snug">{ticket.attendee?.college || 'College N/A'}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-bold">PASS TIER</span>
                <span className="font-extrabold text-blue-700 text-sm block leading-snug">{ticket.passType || 'Hackathon Squad Pass'}</span>
                <span className="text-[11px] text-slate-600 block leading-snug">{ticket.attendee?.track || 'General AI'}</span>
              </div>

              <div className="space-y-0.5 pt-1 border-t sm:border-t-0 border-slate-200">
                <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-bold">REGISTERED CONTACT</span>
                <span className="font-bold text-slate-800 block text-xs">{ticket.attendee?.phone || 'N/A'}</span>
                <span className="text-[11px] text-slate-600 block break-all">{ticket.attendee?.email || ''}</span>
              </div>

              <div className="space-y-0.5 pt-1 border-t sm:border-t-0 border-slate-200">
                <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-bold">CAMPUS VENUE & DATES</span>
                <span className="font-bold text-blue-700 block text-xs">{eventSettings.dates}</span>
                <span className="text-[11px] text-slate-600 block leading-snug">{eventSettings.venue}</span>
              </div>
            </div>

            {/* Team Squad & Team Members Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono mb-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TEAM SQUAD</span>
                <span className="font-bold text-blue-700 text-xs">{ticket.attendee?.teamName || 'Solo / Squad'}</span>
              </div>
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">TEAM MEMBERS:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>Leader: {ticket.attendee?.fullName || 'N/A'}</span>
                  </div>
                  {teamMembersList.filter(m => !m.toLowerCase().includes(ticket.attendee?.fullName?.toLowerCase() || '___')).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory ID Proof Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono mb-4 flex items-start gap-2 shadow-sm">
              <span className="font-bold text-amber-700 uppercase shrink-0 text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">NOTE</span>
              <span className="leading-snug text-[11px] font-semibold text-amber-900">
                Every member must carry a Govt. verified photo ID proof and valid College ID card at entry.
              </span>
            </div>

            {/* Unique Pass Number & Dynamic Verification QR Code */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">UNIQUE PASS NUMBER</span>
                <div className="text-xl font-extrabold text-blue-600 tracking-wider font-chakra">{ticket.ticketId}</div>
                <p className="text-[11px] text-slate-600 leading-tight">Present this Unique Pass Number at the entry gate desk</p>
                <div className="text-[10px] text-slate-400 pt-0.5">Order Ref: {ticket.orderId || ticket.utrNumber || ticket.ticketId} • Helpline: +91 9604449724</div>
              </div>

              <div id="pass-qr-code" className="p-2 bg-white rounded-2xl border-2 border-blue-500 shadow-md shrink-0">
                <QRCodeSVG
                  value={livePassUrl}
                  size={76}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

          </div>

          {/* PRIMARY ACTION: SEND DIRECT TO WHATSAPP (NO SEARCHING NEEDED) */}
          <div className="space-y-2.5 no-print pt-2">
            
            {attendeePhone ? (
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-chakra font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                title={`Open chat directly with ${attendeeName} (+91 ${attendeePhone}) on WhatsApp`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>{processStatus || 'OPENING WHATSAPP...'}</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 text-emerald-100" />
                    <span>SEND DIRECTLY TO WHATSAPP (+91 {attendeePhone})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono rounded-xl text-center">
                No registered mobile number found for direct WhatsApp link.
              </div>
            )}

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isProcessing}
                className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Download single-page official A4 portrait PDF pass"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isProcessing}
                className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Open native mobile share sheet for other apps"
              >
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Other Apps</span>
              </button>

              <button
                type="button"
                onClick={handleCopyDetails}
                className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Copy pass details and live verification link to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copied Link ✓' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Live Link Indicator */}
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] font-mono text-blue-800 flex items-center justify-between">
              <span className="truncate pr-2">Live Pass: <b>{livePassUrl}</b></span>
              <a
                href={livePassUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-blue-600 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
