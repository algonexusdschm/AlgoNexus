import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EVENT_DETAILS } from '../data/eventData';

export default function Announcement({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  return (
    <section id="announcement" className="py-20 relative border-t border-slate-800/80 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL NATIONAL ANNOUNCEMENT</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-space uppercase text-slate-400 font-bold">
              Smt. Chandibai Himathmal Mansukhani College (CHM)
            </div>
            <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase font-semibold">
              Department of Data Science • Organized under Club Data Decoder
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-white uppercase">
            FLAGSHIP 48-HOUR HACKATHON
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-xl mx-auto">
            Two intense days of collaborative intelligence, software architecture, neural model deployment, and real-world educational problem-solving.
          </p>
        </div>

        {/* Feature Highlight Card */}
        <div className="p-8 sm:p-12 mb-12 relative overflow-hidden rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase rounded-full">
                  NATIONAL EDITION
                </span>
                <span className="text-xs text-slate-400 font-mono">₹1,00,000 Cash Pool Across All Tracks</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-chakra font-black text-white leading-tight">
                Empowering the Next Generation of AI & EduTech Builders
              </h3>

              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm font-mono">
                Whether you develop RAG factual knowledge engines, multimodal tutoring agents, automated code debuggers, spatial classroom vision models, or adaptive pacing algorithms — TechAstra 2026 is your launchpad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Complimentary Meals & Midnight Refreshments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Digital Pass with Instant QR Check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1-on-1 Mentorship from AI Industry Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Verified National Participation Certificates</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenRegister()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Enlist Squad Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-4">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                KEY DETAILS AT A GLANCE
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Venue:</span>
                  <span className="font-bold text-white text-right">{EVENT_DETAILS.college}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className="font-bold text-cyan-300">Open for All College Students (UG/PG)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Squad Size:</span>
                  <span className="font-bold text-white">1 to 4 Members</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Prize Pool:</span>
                  <span className="font-bold text-cyan-400 text-sm">₹1,00,000 Total</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-bold text-white">48-Hour On-Campus Hackathon</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
