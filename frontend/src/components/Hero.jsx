import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import CosmicSorcererHero from './CosmicSorcererHero';

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
      
      {/* Dynamic Cosmic Energy Ambient Backlight */}
      <div className="absolute top-1/4 left-10 w-[30rem] h-[30rem] bg-amber-500/10 blur-[140px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-emerald-500/15 blur-[140px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>DIMENSIONAL INCURSION: ACTIVE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>LATVERIAN CITADEL: ONLINE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-300 text-xs font-mono backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{eventSettings.datesAnnounced ? eventSettings.dates : 'Dates To Be Announced Soon'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-300 text-xs font-mono backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{eventSettings.venue}</span>
          </div>
        </div>

        {/* Hero Main Content: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Info & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-mono text-xs tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              {eventSettings.edition} • Department of Data Science, Smt. CHM College
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15] break-words">
              DIMENSIONS COLLIDE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.45)]">
                COMMAND THE NEXUS.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Welcome to <strong className="font-bold text-white tracking-wide">{eventSettings.name}</strong>. India's premier collegiate multiversal conclave. As cosmic rifts shatter reality, forge breakthrough algorithms, command high-level computation, and claim sovereign bounties.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenRegister()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>CLAIM INVASION PASS</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <a
                href="#characters"
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800/90 text-amber-300 border border-amber-400/40 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>EXPLORE CHAMPIONS</span>
              </a>
            </div>

            {/* Live Countdown HUD */}
            <div className="pt-4 max-w-lg mx-auto lg:mx-0 w-full">
              {eventSettings.datesAnnounced ? (
                <div className="p-4 rounded-2xl doomsday-glass-card border border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-3 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                      <span>INCURSION HORIZON COUNTDOWN</span>
                    </span>
                    <span className="text-[10px] text-slate-400">T-MINUS</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/10">
                      <span className="block text-2xl sm:text-3xl font-black text-white font-mono">{timeLeft.days}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">DAYS</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/10">
                      <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">{timeLeft.hours}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">HOURS</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/10">
                      <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">{timeLeft.minutes}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">MINS</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/10">
                      <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-mono drop-shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse">{timeLeft.seconds}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">SECS</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl doomsday-glass-card border border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2.5 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>INCURSION TIMELINE STATUS</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 uppercase font-semibold">
                      REVEALING SOON
                    </span>
                  </div>

                  <div className="py-2 text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-cyan-300 tracking-wider">
                      [DATES TO BE ANNOUNCED SOON]
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-light">
                      Official incursion dates unlocking soon! Pass bookings and pre-registrations are live.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: 3D Cosmic Sorcerer Hero with Dual Rotating Hand Mandalas */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <CosmicSorcererHero onOpenRegister={onOpenRegister} />
          </div>

        </div>

        {/* Bottom Tactical Metric HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <div className="doomsday-glass-card p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-300 font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">{eventSettings.prizePool}</div>
                <div className="text-[11px] text-slate-300 font-light">Sovereign Bounty Pool</div>
              </div>
            </div>
          </div>

          <div className="doomsday-glass-card p-4 rounded-xl border border-amber-500/40 hover:border-amber-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-amber-300 font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">48 HOURS</div>
                <div className="text-[11px] text-slate-300 font-light">Non-Stop Incursion Sprint</div>
              </div>
            </div>
          </div>

          <div className="doomsday-glass-card p-4 rounded-xl border border-cyan-500/40 hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-300 font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">2,000+</div>
                <div className="text-[11px] text-slate-300 font-light">Multiverse Hackers</div>
              </div>
            </div>
          </div>

          <div className="doomsday-glass-card p-4 rounded-xl border border-purple-500/40 hover:border-purple-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/20 border border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-300 font-mono drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">QUANTUM</div>
                <div className="text-[11px] text-slate-300 font-light">Verified Pass Validation</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
