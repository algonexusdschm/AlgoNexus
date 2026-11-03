import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Zap, Sparkles, BrainCircuit, Layers } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EVENT_DETAILS } from '../data/eventData';

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
      
      {/* Light Glassmorphic Main Card Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-auto">
        
        <div className="relative text-center space-y-5 pt-4">
          
          {/* Institutional Badge: CHM College & Data Science */}
          <div className="inline-flex flex-col items-center justify-center px-6 sm:px-10 py-3 rounded-2xl bg-white/90 border border-slate-200/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 max-w-2xl mx-auto space-y-1 select-none">
            <div className="font-space text-xs sm:text-sm tracking-[0.25em] text-slate-800 uppercase font-black">
              SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE
            </div>
            <div className="font-space text-[11px] sm:text-xs tracking-[0.2em] text-sky-600 uppercase font-bold flex items-center gap-2">
              <span>DEPARTMENT OF DATA SCIENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-purple-600">CLUB DATA DECODER</span>
            </div>
          </div>

          {/* Connected 3D Node Pills (No Green!) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { label: 'AI CORE', color: 'bg-sky-50 text-sky-700 border-sky-300' },
              { label: 'CV SCANNER', color: 'bg-blue-50 text-blue-700 border-blue-300' },
              { label: 'RAG VECTORS', color: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
              { label: 'NLP ATTENTION', color: 'bg-purple-50 text-purple-700 border-purple-300' },
              { label: 'ML SILICON', color: 'bg-cyan-50 text-cyan-700 border-cyan-300' }
            ].map((node, i) => (
              <span
                key={node.label}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border shadow-sm flex items-center gap-1.5 ${node.color}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>{node.label}</span>
                {i < 4 && <span className="text-slate-300 hidden sm:inline ml-1 font-normal">─</span>}
              </span>
            ))}
          </div>

          {/* Main Title Banner */}
          <div className="space-y-2 select-none">
            <h1 className="font-chakra text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 uppercase">
              TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">ASTRA</span> 2026
            </h1>
            <p className="font-space text-sm sm:text-lg md:text-xl font-bold tracking-[0.25em] text-slate-700 uppercase">
              AI IN EDUTECH NATIONAL HACKATHON
            </p>
          </div>

          {/* Hackathon Mission Tagline */}
          <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-mono">
            {EVENT_DETAILS.tagline}
          </p>

          {/* High-Key Interactive CTA Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenRegister()}
              className="px-8 sm:px-10 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-chakra font-black tracking-wider text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>REGISTER FOR HACKATHON</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#tracks"
              className="px-7 py-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-300 text-slate-800 font-chakra font-bold tracking-wider text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>EXPLORE CHALLENGE TRACKS</span>
            </a>
          </div>

          {/* Quick Pillars Grid (No Green!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-slate-900">{EVENT_DETAILS.prizePool} Cash Pool</div>
                <div className="text-[11px] text-slate-500 font-mono">Prizes for all AI Tracks</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-slate-900">300+ Innovators</div>
                <div className="text-[11px] text-slate-500 font-mono">80+ Universities Across India</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-chakra font-bold text-slate-900">Free Food & Swag</div>
                <div className="text-[11px] text-slate-500 font-mono">Hardware & Cloud Credits</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
