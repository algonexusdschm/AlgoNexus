import React from 'react';
import { Check, ArrowRight, Star, Shield, Sparkles, BrainCircuit } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function PricingSection({ onSelectTier }) {
  const { pricingTiers } = useEvent();

  return (
    <section id="passes" className="py-24 relative bg-transparent border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>OFFICIAL REGISTRATION PASS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
            HACKATHON SQUAD PASS
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-mono max-w-xl mx-auto">
            One pass covers your entire team of 2 to 4 members. Direct settlement via College UPI QR & GPay with zero gateway fees.
          </p>
        </div>

        {/* Centered Single Squad Pass Card */}
        <div className="max-w-xl mx-auto">
          {pricingTiers.map((tier) => {
            return (
              <div
                key={tier.id}
                className="relative rounded-3xl p-8 sm:p-10 bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/15 flex flex-col justify-between transition-all duration-300"
              >
                {/* Popular / Flagship Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white text-[10px] font-chakra font-black tracking-widest uppercase rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current text-yellow-300" />
                  <span>ALL-INCLUSIVE TEAM PASS (2 TO 4 MEMBERS)</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {tier.badge || 'Flagship Squad Pass'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Smt. CHM College
                    </span>
                  </div>

                  <h3 className="text-2xl font-chakra font-black text-slate-900 mt-4">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2 font-mono">
                    <span className="text-5xl font-chakra font-black text-blue-600">₹{tier.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">/ team pass (covers 2-4 members)</span>
                  </div>

                  <p className="text-xs text-slate-600 font-mono mt-2 pb-4 border-b border-slate-100">
                    Just ₹250 to ₹500 per member. Flat ₹1,000 for your entire hackathon squad!
                  </p>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3.5 text-xs font-mono text-slate-700">
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
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-chakra font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <span>REGISTER YOUR SQUAD NOW (₹{tier.price})</span>
                    <ArrowRight className="w-4 h-4" />
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
