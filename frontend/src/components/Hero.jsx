import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';

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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-transparent border-b border-white/10">
      
      {/* Subtle Ambient Backlight (Matching the Arcane Hall) */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-amber-500/5 blur-[120px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>MULTIVERSE INCURSION: ACTIVE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-300 text-xs font-mono backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{eventSettings.datesAnnounced ? eventSettings.dates : 'Dates To Be Announced Soon'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-300 text-xs font-mono backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Latverian Citadel • {eventSettings.venue}</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative text-center space-y-6 md:space-y-8">
          {/* Subtle radial shadow behind hero content to ensure 100% text clarity over the bold character */}
          <div className="absolute -inset-4 sm:-inset-10 bg-radial from-slate-950/80 via-slate-950/40 to-transparent -z-10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-block px-4 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs tracking-wider backdrop-blur-md shadow-lg">
            {eventSettings.edition} • Department of Data Science, Smt. CHM College
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[6.2rem] leading-none text-center flex flex-col items-center mb-6 drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]">
            <span className="avengers-chrome block pb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">ALGONEXUS</span>
            <span className="doomsday-neon block text-2xl sm:text-4xl md:text-5xl mt-2 relative z-10 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">DOOMSDAY PROTOCOL</span>
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 rounded-2xl bg-slate-950/65 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
            <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Welcome to <strong className="font-bold text-emerald-400 tracking-wide">{eventSettings.name}</strong>, the premier collegiate multiverse hackathon. 
              As cosmic rifts shatter reality, forge breakthrough algorithms and command high-level computation to save the timeline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenRegister()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:shadow-[0_0_36px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <a
              href="#passes"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VIEW EVENT PASSES</span>
            </a>
          </div>

          {/* Live Countdown HUD */}
          <div className="pt-8 max-w-2xl mx-auto w-full">
            {eventSettings.datesAnnounced ? (
              <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 mb-4 tracking-widest">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>HACKATHON COMMENCES IN</span>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-white font-mono">{timeLeft.days}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">DAYS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-amber-400 font-mono">{timeLeft.hours}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">HOURS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-emerald-400 font-mono">{timeLeft.minutes}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">MINS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-cyan-400 font-mono">{timeLeft.seconds}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">SECS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 shadow-xl">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>EVENT TIMELINE STATUS</span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 tracking-wider">
                  DATES TO BE ANNOUNCED
                </div>
                <p className="text-sm text-slate-300 mt-2 font-light">
                  Official hackathon dates will be revealed soon. Registrations are currently open.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tactical Metric HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">{eventSettings.prizePool}</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Prize Pool</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">48 HOURS</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Non-Stop Hackathon</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">500+</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Expected Participants</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">CERTIFIED</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Participation Certs</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
