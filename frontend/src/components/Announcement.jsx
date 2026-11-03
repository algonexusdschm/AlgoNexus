import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EVENT_DETAILS } from '../data/eventData';

export default function Announcement({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  return (
    <section id="announcement" className="py-20 relative border-t border-slate-200/80 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>OFFICIAL NATIONAL ANNOUNCEMENT</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-space uppercase text-slate-500 font-bold">
              Smt. Chandibai Himathmal Mansukhani College (CHM)
            </div>
            <div className="text-xs sm:text-sm font-mono text-blue-600 uppercase font-semibold">
              Department of Data Science • Organized under Club Data Decoder
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
            FLAGSHIP 48-HOUR HACKATHON
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-mono max-w-xl mx-auto">
            Two intense days of collaborative intelligence, software architecture, neural model deployment, and real-world educational problem-solving.
          </p>
        </div>

        {/* Feature Highlight Card */}
        <div className="p-8 sm:p-12 mb-12 relative overflow-hidden rounded-3xl bg-white/90 border border-slate-200/90 shadow-xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase rounded-full">
                  NATIONAL EDITION
                </span>
                <span className="text-xs text-slate-500 font-mono">₹1,00,000 Cash Pool Across All Tracks</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-chakra font-black text-slate-900 leading-tight">
                Empowering the Next Generation of AI & EduTech Builders
              </h3>

              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm font-mono">
                Whether you develop RAG factual knowledge engines, multimodal tutoring agents, automated code debuggers, spatial classroom vision models, or adaptive pacing algorithms — TechAstra 2026 is your launchpad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Complimentary Meals & Midnight Refreshments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Digital Pass with Instant QR Check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>1-on-1 Mentorship from AI Industry Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified National Participation Certificates</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenRegister()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-chakra font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Enlist Squad Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 sm:p-8 rounded-3xl border border-blue-100 space-y-4">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                KEY DETAILS AT A GLANCE
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-bold text-slate-900 text-right">{EVENT_DETAILS.college}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-slate-500">Eligibility:</span>
                  <span className="font-bold text-blue-700">Open for All College Students (UG/PG)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-slate-500">Squad Size:</span>
                  <span className="font-bold text-slate-900">1 to 4 Members</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-slate-500">Prize Pool:</span>
                  <span className="font-bold text-blue-700 text-sm">₹1,00,000 Total</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-bold text-slate-900">48-Hour On-Campus Hackathon</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
