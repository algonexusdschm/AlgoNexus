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
    <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent pointer-events-none w-full max-w-7xl mx-auto">
      
      {/* Spacer to balance top margin */}
      <div className="h-2" />

      {/* Main Hero Centerpiece */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6 pointer-events-auto">
        
        {/* Institutional Badge: CHM College & Data Science */}
        <div className="inline-flex flex-col items-center justify-center px-4 sm:px-12 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 max-w-full sm:max-w-2xl mx-auto space-y-1 select-none">
          <div className="font-space text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.25em] text-slate-800 uppercase font-black text-center">
            SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE
          </div>
          <div className="font-space text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] text-sky-600 uppercase font-bold flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span>DEPARTMENT OF DATA SCIENCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-purple-600">CLUB DATA DECODER</span>
          </div>
        </div>

        {/* Grand Title Banner for Widescreen Laptop Display */}
        <div className="space-y-2 sm:space-y-3 select-none">
          <h1 className="font-chakra text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-slate-900 uppercase leading-none">
            TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">ASTRA</span> 2026
          </h1>
          <p className="font-space text-xs sm:text-xl md:text-2xl font-bold tracking-[0.15em] sm:tracking-[0.25em] text-slate-700 uppercase">
            AI IN EDUTECH NATIONAL HACKATHON
          </p>
        </div>

        {/* Mission Tagline */}
        <p className="max-w-3xl mx-auto text-slate-600 text-xs sm:text-base md:text-lg leading-relaxed font-mono px-2">
          {EVENT_DETAILS.tagline}
        </p>

        {/* High-Key Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none mx-auto">
          <button
            onClick={() => onOpenRegister()}
            className="w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-chakra font-black tracking-wider text-xs sm:text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>REGISTER FOR HACKATHON</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#tracks"
            className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-chakra font-bold tracking-wider text-xs sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Layers className="w-5 h-5 text-blue-600 shrink-0" />
            <span>EXPLORE CHALLENGE TRACKS</span>
          </a>
        </div>

      </div>

      {/* Bottom Pillars Grid: Anchoring the Laptop Screen */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto pt-8 pointer-events-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-chakra font-black text-slate-900">{EVENT_DETAILS.prizePool} Cash Pool</div>
              <div className="text-xs text-slate-500 font-mono">Prizes for all AI Tracks</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-chakra font-black text-slate-900">300+ Innovators</div>
              <div className="text-xs text-slate-500 font-mono">80+ Universities Across India</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-chakra font-black text-slate-900">Free Food & Swag</div>
              <div className="text-xs text-slate-500 font-mono">Hardware & Cloud Credits</div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
