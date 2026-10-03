import React from 'react';
import { Check, ArrowRight, Star, Shield, Box, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function PricingSection({ onSelectTier }) {
  const { pricingTiers } = useEvent();

  return (
    <section id="passes" className="py-24 relative bg-[#0d121c]/75 backdrop-blur-sm border-b-4 border-mc-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>[EXPEDITION PROTOCOL TIERS]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            <span className="text-white drop-shadow-md block mb-2 tracking-wide text-xl sm:text-2xl font-bold">SECURE YOUR</span>
            <span className="doomsday-title text-[3rem] sm:text-[4rem] md:text-[5.5rem] leading-[0.9] block">EXPEDITION PASS</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Choose your clearance level for the hackathon. Verified securely via official UPI & digital encryption.
          </p>
        </div>

        {/* Tiers Grid Styled as 3D Minecraft Ore Tiers */}
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
                    ? 'bg-gradient-to-b from-[#1b2b3b] via-[#121c27] to-[#0b121a] border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] md:-translate-y-2'
                    : isVIP
                    ? 'bg-gradient-to-b from-[#2e121a] via-[#1c0b10] to-[#12070a] border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                    : isSolo
                    ? 'bg-gradient-to-b from-[#0e241b] via-[#091712] to-[#07100c] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]'
                    : 'voxel-box'
                }`}
              >
                {/* Popular Ribbon */}
                {isDiamond && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 border-2 border-black text-slate-950 text-[10px] font-mc font-black tracking-wider uppercase shadow-voxel-btn flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" />
                    <span>FLAGSHIP SQUAD PASS</span>
                  </div>
                )}

                {isSolo && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-400 border-2 border-black text-slate-950 text-[10px] font-mc font-black tracking-wider uppercase shadow-voxel-btn flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>BEST FOR INDIVIDUALS</span>
                  </div>
                )}

                {isVIP && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-500 border-2 border-black text-white text-[10px] font-mc font-black tracking-wider uppercase shadow-voxel-btn flex items-center gap-1.5 whitespace-nowrap">
                    <Box className="w-3 h-3 fill-current" />
                    <span>ALL-INCLUSIVE PASS</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mc px-2 py-0.5 border ${
                      isDiamond
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : isVIP
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : isSolo
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-mc-deepslate border-mc-border text-slate-300'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mt-4 font-mc">{tier.name}</h3>

                  {/* Price Display */}
                  <div className="mt-3 mb-6 flex items-baseline gap-1.5 border-b border-mc-border pb-4">
                    <span className="text-sm font-bold text-slate-400">₹</span>
                    <span className={`text-4xl sm:text-5xl font-black font-mc ${
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
                        <span className={`w-4 h-4 border flex items-center justify-center shrink-0 text-[10px] font-bold ${
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
                  className={`w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    isDiamond
                      ? 'btn-voxel-diamond shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                      : isVIP
                      ? 'btn-voxel-redstone shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                      : 'btn-voxel-emerald shadow-[0_0_20px_rgba(16,185,129,0.35)]'
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
        <div className="mt-12 p-4 voxel-box rounded-xl flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-mc-emerald" />
            <span>256-Bit SSL Bedrock Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-mc-diamond"></span>
            <span>Instant GPay QR & UTR Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-mc-redstone"></span>
            <span>Digital E-Ticket with Scannable QR Code</span>
          </div>
        </div>

      </div>
    </section>
  );
}
