import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Printer, ShieldCheck, Calendar, MapPin, Sparkles, Building2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';

export default function TicketModal({ ticket, isOpen, onClose }) {
  const { eventSettings } = useEvent();
  const isPaid = ticket?.paymentStatus === 'PAID';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all z-20 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner */}
        {isPaid ? (
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-6 text-white text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2.5 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-chakra font-black tracking-wide uppercase">TECHASTRA 2026 PASS CONFIRMED!</h3>
            <p className="text-xs text-sky-100 mt-1 font-mono">Payment verified. Your official delegate credentials are live.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-2.5 shadow-sm">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-chakra font-black tracking-wide uppercase">REGISTRATION SUBMITTED</h3>
            <p className="text-xs text-amber-100 mt-1 font-mono">Queued for organizer verification. Keep your Ticket ID safe!</p>
          </div>
        )}

        {/* Digital Ticket Card */}
        <div id="printable-ticket" className="p-6 space-y-6">
          
          <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
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
            <div className="grid grid-cols-2 gap-4 text-xs mb-5 font-mono">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">ATTENDEE NAME</span>
                <span className="font-bold text-slate-900 text-sm block">{ticket.attendee?.fullName || 'N/A'}</span>
                <span className="text-[11px] text-slate-600 block truncate">{ticket.attendee?.college}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">PASS TIER</span>
                <span className="font-bold text-blue-600 text-sm block">{ticket.passType}</span>
                <span className="text-[11px] text-slate-600 block">{ticket.attendee?.track}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">EVENT DATES</span>
                <span className="font-semibold text-slate-800">{eventSettings.dates}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">CAMPUS VENUE</span>
                <span className="font-semibold text-slate-800">{eventSettings.venue}</span>
              </div>
            </div>

            {ticket.attendee?.teamName && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs mb-4 font-mono flex items-center justify-between">
                <span className="text-slate-500 font-bold uppercase text-[10px]">TEAM SQUAD:</span>
                <span className="font-bold text-blue-700">{ticket.attendee.teamName}</span>
              </div>
            )}

            {/* Perforated separator */}
            <div className="relative flex items-center justify-between my-4">
              <div className="w-3 h-6 bg-white border-r-2 border-slate-200 -ml-6 rounded-r-full" />
              <div className="w-full border-t-2 border-dashed border-slate-200 mx-2" />
              <div className="w-3 h-6 bg-white border-l-2 border-slate-200 -mr-6 rounded-l-full" />
            </div>

            {/* QR Code and Gate Scanner section */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">OFFICIAL CHECK-IN SCANNER</span>
                <p className="text-xs text-slate-700">Present at Entry Desk with College ID</p>
                <div className="text-[10px] text-slate-400">Order Ref: {ticket.orderId}</div>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <QRCodeSVG
                  value={`https://techastra.college/verify/${ticket.ticketId}`}
                  size={76}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / SAVE DELEGATE PASS</span>
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
