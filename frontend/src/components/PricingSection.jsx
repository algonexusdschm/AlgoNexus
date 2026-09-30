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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border border-mc-emerald/40 text-mc-emerald text-xs font-mc mb-3">
            <Sparkles className="w-3.5 h-3.5 text-mc-emerald" />
            <span>[EXPEDITION PASS TIERS]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            CHOOSE YOUR <span className="text-mc-diamond font-mc">EXPEDITION PASS</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-light">
            Secure your slot before registrations reach bedrock limits. Verified securely with UPI, GPay QR, Bank Transfer & Cards.
          </p>
        </div>

        {/* Tiers Grid Styled as 3D Minecraft Ore Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const isDiamond = tier.popular;
            const isVIP = tier.id === 'all-access-vip';

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isDiamond
                    ? 'bg-gradient-to-b from-[#1b263b] to-[#121927] border-2 border-mc-diamond shadow-diamond-glow md:-translate-y-2'
                    : isVIP
                    ? 'bg-gradient-to-b from-[#221c33] to-[#14121f] border-2 border-mc-amethyst hover:border-mc-diamond'
                    : 'voxel-box'
                }`}
              >
                {/* Popular Diamond Ribbon */}
                {isDiamond && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-mc-diamond border-2 border-black text-slate-950 text-[10px] font-mc font-black tracking-wider uppercase shadow-voxel-btn flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" />
                    <span>FLAGSHIP EXPEDITION</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mc px-2 py-0.5 border ${
                      isDiamond
                        ? 'bg-mc-diamond/20 border-mc-diamond text-mc-diamond'
                        : isVIP
                        ? 'bg-mc-amethyst/20 border-mc-amethyst text-mc-amethyst'
                        : 'bg-mc-deepslate border-mc-border text-slate-400'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mt-4 font-mc">{tier.name}</h3>

                  {/* Price Display */}
                  <div className="mt-3 mb-6 flex items-baseline gap-1.5 border-b border-mc-border pb-4">
                    <span className="text-sm font-bold text-slate-400">₹</span>
                    <span className={`text-4xl sm:text-5xl font-black font-mc ${
                      isDiamond ? 'text-mc-diamond' : isVIP ? 'text-mc-amethyst' : 'text-white'
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
                            ? 'bg-mc-diamond/20 border-mc-diamond text-mc-diamond'
                            : isVIP
                            ? 'bg-mc-amethyst/20 border-mc-amethyst text-mc-amethyst'
                            : 'bg-mc-emerald/20 border-mc-emerald text-mc-emerald'
                        }`}>
                          ✓
                        </span>
                        <span className="text-slate-300 leading-snug font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectTier(tier)}
                  className={`w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    isDiamond
                      ? 'btn-voxel-diamond'
                      : isVIP
                      ? 'btn-voxel-redstone'
                      : 'btn-voxel-emerald'
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
