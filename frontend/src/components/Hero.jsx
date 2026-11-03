import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Zap, Sparkles, BrainCircuit, GraduationCap, Eye } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EVENT_DETAILS, FACULTY_COMMITTEE } from '../data/eventData';

export default function Hero({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  // Live Countdown to Event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = eventSettings.targetDate || '2026-10-16T09:00:00+05:30';
      const difference = +new Date(target) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 16, hours: 8, minutes: 22, seconds: 45 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventSettings.targetDate]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-20 overflow-hidden bg-transparent pointer-events-none">
      
      {/* Futuristic Sci-Fi Main Card Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-auto">
        
        <div className="relative text-center space-y-5 pt-4">
          
          {/* Institutional Badge: CHM College & Data Science */}
          <div className="inline-flex flex-col items-center justify-center px-6 sm:px-10 py-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-xl shadow-cyan-950/40 max-w-2xl mx-auto space-y-1 select-none">
            <div className="font-space text-xs sm:text-sm tracking-[0.25em] text-slate-200 uppercase font-black">
              SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE
            </div>
            <div className="font-space text-[11px] sm:text-xs tracking-[0.2em] text-cyan-400 uppercase font-bold flex items-center gap-2">
              <span>DEPARTMENT OF DATA SCIENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-purple-400">CLUB DATA DECODER</span>
            </div>
          </div>

          {/* Connected 3D Node Pills (No Green!) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { label: 'CV SCANNER', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' },
              { label: 'RAG VECTORS', color: 'bg-blue-950/80 text-blue-300 border-blue-500/40' },
              { label: 'NLP ATTENTION', color: 'bg-purple-950/80 text-purple-300 border-purple-500/40' },
              { label: 'ML SILICON', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40' },
              { label: 'AI SYNTHESIS', color: 'bg-sky-950/80 text-sky-300 border-sky-500/40' }
            ].map((node, i) => (
              <span
                key={node.label}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border shadow-sm flex items-center gap-1.5 ${node.color}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>{node.label}</span>
                {i < 4 && <span className="text-slate-600 hidden sm:inline ml-1 font-normal">─</span>}
              </span>
            ))}
          </div>

          {/* Main Title Banner */}
          <div className="space-y-2 select-none">
            <h1 className="font-chakra text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">ASTRA</span> 2026
            </h1>
            <p className="font-space text-sm sm:text-lg md:text-xl font-bold tracking-[0.25em] text-cyan-300 uppercase">
              AI IN EDUTECH NATIONAL HACKATHON
            </p>
          </div>

          {/* Hackathon Mission Tagline */}
          <p className="max-w-2xl mx-auto text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-mono">
            {EVENT_DETAILS.tagline}
          </p>

          {/* High-Key Interactive CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenRegister()}
              className="px-8 sm:px-10 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra font-black tracking-wider text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>REGISTER FOR HACKATHON</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#ai-3d-lab"
              className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 font-chakra font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>EXPLORE 3D AI LAB</span>
            </a>

            <a
              href="#faculty"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-700 text-slate-300 font-chakra font-bold tracking-wider text-sm shadow-md transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>FACULTY MENTORS</span>
            </a>
          </div>

          {/* ========================================================================= */}
          {/* 🎓 FACULTY LEADERSHIP & CO-ORDINATOR BANNER                                */}
          {/* ========================================================================= */}
          <div id="faculty" className="pt-4 max-w-4xl mx-auto w-full">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-left space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-chakra font-black tracking-wider uppercase text-white">
                      FACULTY ADVISORY & EVENT LEADERSHIP
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">Department of Data Science • Smt. CHM College</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/40">
                  OFFICIAL MENTORS
                </span>
              </div>

              {/* Faculty Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                
                {/* 1. Co-ordinator Dr. Shiji Johnson */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-950/90 to-slate-900 border-2 border-cyan-500/80 shadow-md sm:col-span-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 block w-fit mb-2">
                      EVENT CO-ORDINATOR
                    </span>
                    <h4 className="text-sm font-chakra font-black text-white">
                      Dr. Shiji Johnson
                    </h4>
                    <p className="text-[10px] font-mono text-cyan-300 font-semibold mt-0.5">
                      Co-ordinator
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">
                      Dept. of Data Science
                    </p>
                  </div>
                </div>

                {/* 2. Ms. Kalyani Patil */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 block w-fit mb-2">
                      TEACHER / MENTOR
                    </span>
                    <h4 className="text-sm font-chakra font-bold text-white">
                      Ms. Kalyani Patil
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Assistant Professor
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">
                      Dept. of Data Science
                    </p>
                  </div>
                </div>

                {/* 3. Ms. Razia Khan */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 block w-fit mb-2">
                      TEACHER / MENTOR
                    </span>
                    <h4 className="text-sm font-chakra font-bold text-white">
                      Ms. Razia Khan
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Assistant Professor
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">
                      Dept. of Data Science
                    </p>
                  </div>
                </div>

                {/* 4. Mr. Anshul Chimnani */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 block w-fit mb-2">
                      TEACHER / MENTOR
                    </span>
                    <h4 className="text-sm font-chakra font-bold text-white">
                      Mr. Anshul Chimnani
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Assistant Professor
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">
                      Dept. of Data Science
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Quick Pillars Grid (No Green!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-white">{EVENT_DETAILS.prizePool} Cash Pool</div>
                <div className="text-[11px] text-slate-400 font-mono">Prizes for all AI Tracks</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-purple-500/20 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-white">300+ Innovators</div>
                <div className="text-[11px] text-slate-400 font-mono">80+ Universities Across India</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-blue-500/20 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-white">Free Food & Swag</div>
                <div className="text-[11px] text-slate-400 font-mono">Hardware & Cloud Credits</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
