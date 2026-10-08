import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_LIST } from '../data/eventData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 bg-[#070913] relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-chakra font-black tracking-wide text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl overflow-hidden border border-white/5 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-cyan-300"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
