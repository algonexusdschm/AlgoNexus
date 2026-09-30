import React, { useState } from 'react';
import { Box, Menu, X, Ticket, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar({ onOpenRegister, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/90 backdrop-blur-xl border-b-2 border-mc-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with 3D Voxel Styling */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-mc-deepslate border-2 border-mc-diamond p-1.5 shadow-voxel-btn group-hover:border-mc-redstone transition-colors flex items-center justify-center">
              <div className="w-full h-full bg-[#181e2b] flex items-center justify-center">
                <Box className="w-5 h-5 text-mc-diamond group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mc font-black tracking-wider text-white">
                  ALGO<span className="text-mc-diamond">NEXUS</span>
                </span>
                <span className="text-[10px] font-mc px-2 py-0.5 bg-mc-redstone/20 text-mc-redstone border border-mc-redstone/40">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">National Tech Conclave</p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#announcement" className="hover:text-mc-diamond transition-colors">Announcement</a>
            <a href="#gallery" className="hover:text-mc-diamond transition-colors">2025 Memories</a>
            <a href="#tracks" className="hover:text-mc-diamond transition-colors">Tracks & Quests</a>
            <a href="#passes" className="hover:text-mc-diamond transition-colors">Event Passes</a>
            <a href="#faq" className="hover:text-mc-diamond transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 btn-voxel-dark text-xs flex items-center gap-1.5"
              title="Organizers & Gate Console"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-mc-diamond" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => onOpenRegister()}
              className="px-5 py-2.5 btn-voxel-diamond text-xs flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-mc-deepslate border-2 border-mc-border text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e14] border-b-2 border-mc-border px-4 pt-3 pb-6 space-y-3 font-semibold text-xs uppercase tracking-wider">
          <a
            href="#announcement"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Announcement (2026)
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Last Year Gallery (2025)
          </a>
          <a
            href="#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Tracks & Quests
          </a>
          <a
            href="#passes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Event Passes
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-mc-border flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 btn-voxel-diamond text-xs flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" /> Claim Event Pass
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 btn-voxel-dark text-xs flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-mc-diamond" /> Organizer Admin Console
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
