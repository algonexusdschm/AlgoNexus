import React from 'react';
import { Check, ArrowRight, Star, Shield, Sparkles, BrainCircuit } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function PricingSection({ onSelectTier }) {
  const { pricingTiers } = useEvent();

  return (
    <section id="passes" className="py-24 relative bg-transparent border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>HACKATHON DELEGATE PASSES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-white uppercase">
            CHOOSE YOUR INNOVATION PASS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-xl mx-auto">
            Directly settlements via College UPI QR & GPay. All passes include lunch, snacks, certificates, and compute access.
          </p>
        </div>

        {/* Tiers Grid Styled in Sleek Dark-Cyber Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const isSquad = tier.popular;
            const isVIP = tier.id === 'all-access';

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                  isSquad
                    ? 'bg-slate-900 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 md:-translate-y-3'
                    : isVIP
                    ? 'bg-slate-900/85 border border-purple-500/40 shadow-xl hover:shadow-2xl hover:border-purple-400'
                    : 'bg-slate-900/85 border border-slate-800 shadow-xl hover:shadow-2xl hover:border-cyan-500/40'
                }`}
              >
                {/* Popular Badge */}
                {isSquad && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current text-yellow-300" />
                    <span>FLAGSHIP SQUAD PASS</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-950 text-cyan-300 border border-slate-800">
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-chakra font-bold text-white mt-4">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-1 font-mono">
                    <span className="text-4xl font-chakra font-black text-white">₹{tier.price}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {tier.type === 'team' ? 'team pass' : 'individual'}</span>
                  </div>

                  {/* Features List (No Green!) */}
                  <ul className="mt-6 space-y-3 text-xs font-mono text-slate-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Pass CTA Button */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectTier(tier)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-chakra font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSquad
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>SELECT {tier.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
