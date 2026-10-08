import React from 'react';
import { Check, ArrowRight, Star, Shield, Box, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function PricingSection({ onSelectTier }) {
  const { pricingTiers } = useEvent();

  return (
    <section id="passes" className="py-24 relative bg-[#070a0e]/85 backdrop-blur-sm border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-chakra tracking-wider mb-3 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>[DOOMSDAY PASS TIERS]</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl text-center flex flex-col items-center mb-6">
            <span className="avengers-chrome block pb-1">CHOOSE YOUR</span>
            <span className="doomsday-neon block text-xl sm:text-2xl md:text-3xl mt-1">DOOMSDAY ACCESS PASS</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-light">
            Secure your slot before registrations reach maximum protocol capacity. Verified securely with Official UPI & GPay QR.
          </p>
        </div>

        {/* Tiers Grid Styled as Doomsday Cyber Tactical Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const isDiamond = tier.popular;
            const isVIP = tier.id === 'all-access-vip';
            const isSolo = tier.id === 'solo-coder';

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isDiamond
                    ? 'bg-gradient-to-b from-[#142330] via-[#0d1620] to-[#080d14] border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] md:-translate-y-2'
                    : isVIP
                    ? 'bg-gradient-to-b from-[#2a1017] via-[#1a0a0f] to-[#100609] border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                    : 'bg-gradient-to-b from-[#0b2017] via-[#081510] to-[#050d0a] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]'
                }`}
              >
                {/* Popular Ribbon */}
                {isDiamond && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 border border-black text-slate-950 text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" />
                    <span>FLAGSHIP SQUAD PASS</span>
                  </div>
                )}

                {isSolo && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-400 border border-black text-slate-950 text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>BEST FOR INDIVIDUALS</span>
                  </div>
                )}

                {isVIP && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-500 border border-black text-white text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center gap-1.5 whitespace-nowrap">
                    <Shield className="w-3 h-3 fill-current" />
                    <span>ALL-INCLUSIVE PASS</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-chakra font-bold tracking-wider px-2.5 py-1 rounded border ${
                      isDiamond
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : isVIP
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-chakra font-bold tracking-wide text-white mt-4">{tier.name}</h3>

                  {/* Price Display */}
                  <div className="mt-3 mb-6 flex items-baseline gap-1.5 border-b border-slate-800 pb-4">
                    <span className="text-sm font-bold text-slate-400 font-mono">₹</span>
                    <span className={`text-4xl sm:text-5xl font-chakra font-black ${
                      isDiamond ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]' : isVIP ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    }`}>
                      {tier.price}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">/ pass</span>
                  </div>

                  {/* Feature Bullet Points */}
                  <div className="space-y-3 mb-8 text-xs">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isDiamond
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : isVIP
                            ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        }`}>
                          ✓
                        </span>
                        <span className="text-slate-200 leading-snug font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectTier(tier)}
                  className={`w-full py-3.5 text-xs font-chakra font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isDiamond
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : isVIP
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  <span>[SELECT & REGISTER]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Security badge banner */}
        <div className="mt-12 p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono shadow-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Quantum Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Instant GPay QR & UTR Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Digital E-Ticket with Scannable QR Code</span>
          </div>
        </div>

      </div>
    </section>
  );
}
