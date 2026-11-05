import React from 'react';
import { Check, ArrowRight, Star, Shield, Sparkles, BrainCircuit } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function PricingSection({ onSelectTier }) {
  const { pricingTiers } = useEvent();

  return (
    <section id="passes" className="py-24 relative bg-transparent border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>HACKATHON DELEGATE PASSES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
            CHOOSE YOUR INNOVATION PASS
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-mono max-w-xl mx-auto">
            Directly settlements via College UPI QR & GPay. All passes include lunch, snacks, certificates, and compute access.
          </p>
        </div>

        {/* Tiers Grid Styled in Light-Theme Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const isSquad = tier.popular;
            const isVIP = tier.id === 'all-access';

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isSquad
                    ? 'bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/15 md:-translate-y-3'
                    : isVIP
                    ? 'bg-white border border-purple-200 shadow-lg hover:shadow-xl hover:border-purple-400'
                    : 'bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300'
                }`}
              >
                {/* Popular Badge */}
                {isSquad && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current text-yellow-300" />
                    <span>FLAGSHIP SQUAD PASS</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-chakra font-bold text-slate-900 mt-4">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-1 font-mono">
                    <span className="text-4xl font-chakra font-black text-slate-900">₹{tier.price}</span>
                    <span className="text-xs text-slate-500 font-normal">/ {tier.type === 'team' ? 'team pass' : 'individual'}</span>
                  </div>

                  {/* Features List (No Green!) */}
                  <ul className="mt-6 space-y-3 text-xs font-mono text-slate-600">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
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
                        ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
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
