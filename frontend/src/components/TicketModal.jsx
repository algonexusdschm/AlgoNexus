import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Printer, Box, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';

export default function TicketModal({ ticket, isOpen, onClose }) {
  const { eventSettings } = useEvent();
  const isPaid = ticket?.paymentStatus === 'PAID';

  useEffect(() => {
    if (isOpen && isPaid) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, isPaid]);

  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0b0e14] border-2 border-mc-diamond rounded-2xl shadow-diamond-glow overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-mc-deepslate border border-mc-border text-slate-300 hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner */}
        {isPaid ? (
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 text-white text-center border-b-2 border-mc-border">
            <div className="w-11 h-11 mx-auto bg-black/40 border border-white/20 flex items-center justify-center mb-2 shadow-voxel-sm">
              <CheckCircle2 className="w-6 h-6 text-mc-emerald" />
            </div>
            <h3 className="text-xl font-mc font-black tracking-wider uppercase">EXPEDITION PASS CONFIRMED!</h3>
            <p className="text-xs text-cyan-100 mt-1 font-mono">Payment verified. Your official gate pass has been forged.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 p-6 text-white text-center border-b-2 border-mc-border">
            <div className="w-11 h-11 mx-auto bg-black/40 border border-white/20 flex items-center justify-center mb-2 shadow-voxel-sm">
              <Clock className="w-6 h-6 text-yellow-300" />
            </div>
            <h3 className="text-xl font-mc font-black tracking-wider uppercase">REGISTRATION SUBMITTED</h3>
            <p className="text-xs text-yellow-100 mt-1 font-mono">Payment reference queued for organizer verification. Keep your Ticket ID safe!</p>
          </div>
        )}

        {/* The Digital Holographic 3D Minecraft Ticket Card */}
        <div id="printable-ticket" className="p-6 space-y-6">
          
          <div className="relative voxel-box p-6 rounded-xl overflow-hidden border-2 border-mc-diamond/50">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-mc-border pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-mc-deepslate border border-mc-diamond flex items-center justify-center">
                  <Box className="w-4 h-4 text-mc-diamond" />
                </div>
                <div>
                  <div className="text-xs font-mc font-bold text-white tracking-wider">
                    TECH<span className="text-mc-diamond">ASTRA</span> 2026
                  </div>
                  <div className="text-[10px] text-mc-diamond font-mono font-medium">CLUB DATA DECODER • DEPT OF DATA SCIENCE • SMT. CHM COLLEGE</div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[9px] font-mc px-2 py-0.5 border ${
                  isPaid 
                    ? 'bg-mc-emerald/20 text-mc-emerald border-mc-emerald/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isPaid ? 'PAID & VERIFIED' : 'PENDING VERIFICATION'}
                </span>
                <div className="text-[10px] font-mono text-mc-diamond mt-1 font-bold">{ticket.ticketId}</div>
              </div>
            </div>

            {/* Attendee Details Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-xs mb-5 font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mc">ATTENDEE</span>
                <span className="font-bold text-white text-sm">{ticket.attendee?.fullName || 'N/A'}</span>
                <span className="text-[11px] text-slate-300 block truncate">{ticket.attendee?.college}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mc">PASS TIER</span>
                <span className="font-bold text-mc-diamond text-sm">{ticket.passType}</span>
                <span className="text-[11px] text-slate-300 block">{ticket.attendee?.track}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mc">EXPEDITION DATES</span>
                <span className="font-semibold text-slate-200">{eventSettings.dates}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mc">ARENA VENUE</span>
                <span className="font-semibold text-slate-200">{eventSettings.venue}</span>
              </div>
            </div>

            {ticket.attendee?.teamName && (
              <div className="p-2.5 bg-mc-deepslate border border-mc-border text-xs mb-4 font-mono">
                <span className="text-mc-diamond font-bold font-mc">TEAM SQUAD: </span>
                <span className="text-white">{ticket.attendee.teamName}</span>
              </div>
            )}

            {/* Perforated separator */}
            <div className="relative flex items-center justify-between my-4">
              <div className="w-3 h-6 bg-[#0b0e14] border-r-2 border-mc-diamond/50 -ml-6" />
              <div className="w-full border-t-2 border-dashed border-mc-border mx-2" />
              <div className="w-3 h-6 bg-[#0b0e14] border-l-2 border-mc-diamond/50 -mr-6" />
            </div>

            {/* QR Code and Gate Scanner section */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mc">BEDROCK GATE SCANNER</span>
                <p className="text-xs text-slate-300">Scan at Entry Desk with College ID</p>
                <div className="text-[10px] text-slate-500">Order: {ticket.orderId}</div>
              </div>

              <div className="p-2 bg-white border-2 border-mc-diamond shadow-md">
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
              className="flex-1 py-3 btn-voxel-diamond text-xs uppercase flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>[PRINT / SAVE PASS]</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 btn-voxel-dark text-xs uppercase"
            >
              DONE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
