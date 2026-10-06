import React from 'react';
import { ArrowRight, Calendar, CheckCircle2, Clock, Trophy, ShieldCheck, Terminal, Radio } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Announcement({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  return (
    <section id="announcement" className="py-20 relative border-b border-emerald-500/20 bg-slate-950/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-chakra tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>[OFFICIAL EVENT ANNOUNCEMENT]</span>
          </div>

          <div className="mb-3 space-y-1">
            <div className="text-xs sm:text-sm font-chakra tracking-[0.2em] uppercase text-slate-300 font-semibold">
              Smt. Chandibai Himathmal Mansukhani College
            </div>
            <div className="text-xs sm:text-sm font-space text-emerald-400 tracking-wider uppercase font-medium">
              Department of Data Science <span className="text-slate-500">•</span> Organized under <span className="text-white underline decoration-emerald-500/60 font-bold">Club Data Decoder</span>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-center flex flex-col items-center mb-5">
            <span className="font-bebas tracking-wide block text-slate-400">ANNOUNCING</span>
            <span className="font-bebas tracking-wider text-white text-4xl sm:text-6xl md:text-7xl mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              TECH ASTRA 2026
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light font-space max-w-2xl mx-auto leading-relaxed">
            Prepare your squads for the national engineering conclave. Two days of intense problem-solving, development, collaboration, and innovation.
          </p>
        </div>

        {/* Feature Highlight Card */}
        <div className="p-8 sm:p-12 mb-16 relative overflow-hidden rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-chakra font-bold tracking-wider uppercase rounded-md">
                  FLAGSHIP 48-HOUR HACKATHON
                </span>
                <span className="text-xs text-slate-400 font-mono">Theme: 48 Hours. One Problem. Unlimited Possibilities.</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-space">
                48-Hour Hackathon with ₹1,00,000 Cash Prize Pool
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-light">
                Whether you build autonomous neural agents, architect high-throughput distributed microservices, solve complex algorithmic graphs, or harden zero-day cybersecurity defenses — TechAstra 2026 is your forge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px] font-bold">✓</span>
                  <span>Complimentary Meals & Midnight Energy Rations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-bold">✓</span>
                  <span>Encrypted Digital Pass with QR Gate Check-in</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px] font-bold">✓</span>
                  <span>48-Hour Dedicated Workspace & High-Speed Power Setup</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-[10px] font-bold">✓</span>
                  <span>Official Certificate of Excellence & Achievement</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onOpenRegister && onOpenRegister()}
                  className="btn-doomsday-cyber px-8 py-3.5 text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                >
                  <span className="font-chakra font-bold tracking-widest text-emerald-300">[SECURE SQUAD PASS]</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>

            {/* Operational Schedule Snapshot */}
            <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-2xl border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-chakra font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>OPERATIONAL TIMELINE</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">
                  48-HOUR SCHEDULE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-chakra text-emerald-400 font-bold mb-1">
                    <span>PHASE 01 • THE COUNTDOWN</span>
                    <span className="font-mono text-[10px] text-slate-400">09:00 AM</span>
                  </div>
                  <p className="font-bold text-white font-space">Opening Ceremony & Problem Statement Reveal</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Squad registration check-in, rules briefing, and challenge launch.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-chakra text-amber-400 font-bold mb-1">
                    <span>PHASE 02 • THE 48-HOUR SPRINT</span>
                    <span className="font-mono text-[10px] text-slate-400">DAY 1–2</span>
                  </div>
                  <p className="font-bold text-white font-space">Sprint Development & Mentor Reviews</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Rapid coding, architectural prototyping, scheduled mentor checkpoints.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-chakra text-rose-400 font-bold mb-1">
                    <span>PHASE 03 • SYSTEM LOCKDOWN</span>
                    <span className="font-mono text-[10px] text-slate-400">09:00 AM</span>
                  </div>
                  <p className="font-bold text-white font-space">Code Freeze & Final Repository Submission</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Commit hash verification and live demonstration readiness.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-chakra text-cyan-400 font-bold mb-1">
                    <span>PHASE 04 • FINAL JUDGEMENT & FINALE</span>
                    <span className="font-mono text-[10px] text-slate-400">03:00 PM</span>
                  </div>
                  <p className="font-bold text-white font-space">Live Jury Demos & ₹1,00,000 Prize Ceremony</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Technical code viva, grand winners declaration, and awards distribution.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
