import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SurvivalProtocol from './components/SurvivalProtocol';
import Announcement from './components/Announcement';
import Gallery from './components/Gallery';
import PricingSection from './components/PricingSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AiUniverse3D from './components/AiUniverse3D';
import AiBackground3D from './components/AiBackground3D';
import { EventProvider, useEvent } from './context/EventContext';

// Lazy-loaded heavy modules for optimal initial load speed
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const TicketModal = lazy(() => import('./components/TicketModal'));
const AdminPage = lazy(() => import('./components/AdminPage'));

function MainEventApp() {
  const { pricingTiers } = useEvent();
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (path === '/admin' || hash === '#admin') ? 'admin' : 'event';
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('algonexus_checkout_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000) {
          return true;
        }
      }
    } catch {}
    return false;
  });

  const [selectedTier, setSelectedTier] = useState(() => {
    try {
      const saved = localStorage.getItem('algonexus_checkout_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tierId && pricingTiers && pricingTiers.length > 0) {
          const match = pricingTiers.find(t => t.id === parsed.tierId);
          if (match) return match;
        }
      }
    } catch {}
    return pricingTiers[0];
  });
  const [issuedTicket, setIssuedTicket] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Sync routing on popstate / hashchange
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('event');
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentRoute('admin');
    window.scrollTo(0, 0);
  };

  const navigateToEvent = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('event');
    window.scrollTo(0, 0);
  };

  const handleOpenRegister = (tier = null) => {
    if (tier) setSelectedTier(tier);
    else setSelectedTier(pricingTiers[0]);
    setIsRegisterOpen(true);
  };

  const handlePaymentSuccess = (ticket) => {
    setIssuedTicket(ticket);
    setIsTicketOpen(true);
  };

  // If on Admin Website Route
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 overflow-x-hidden">
        {/* Global 3D WebGL Background Canvas */}
        <AiBackground3D />
        <div className="relative z-10 flex-1 flex flex-col">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-400 font-chakra text-sm tracking-widest animate-pulse">CONNECTING TO GATE CONSOLE...</div>}>
            <AdminPage onBackToWebsite={navigateToEvent} />
          </Suspense>
        </div>
      </div>
    );
  }

  // Public Event Website
  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 1. Global 3D WebGL Spatial Universe Canvas (Pure 3D, zero static wallpaper) */}
      <AiBackground3D />

      {/* 2. Top Navbar with Admin Portal Trigger */}
      <Navbar
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* 3. Main Content Sections */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <Hero onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* Dedicated 3D Interactive AI in EduTech Holodeck */}
        <AiUniverse3D />

        {/* The Survival Protocol (Structure, Judging, AI Policy, Open For All Eligibility) */}
        <SurvivalProtocol onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* Official Announcement Section for This Year's Event */}
        <Announcement onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* Photo Gallery of Last Year's Event with Centered Modal Lightbox */}
        <Gallery />

        {/* Passes & Pricing Tiers with Razorpay & Bank checkout triggers */}
        <PricingSection onSelectTier={(tier) => handleOpenRegister(tier)} />

        {/* FAQs */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Interactive Modals (Lazy Loaded on Demand) */}
      <Suspense fallback={null}>
        {isRegisterOpen && (
          <RegistrationModal
            isOpen={isRegisterOpen}
            initialTier={selectedTier}
            onClose={() => setIsRegisterOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {isTicketOpen && issuedTicket && (
          <TicketModal
            ticket={issuedTicket}
            isOpen={isTicketOpen}
            onClose={() => setIsTicketOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <MainEventApp />
    </EventProvider>
  );
}
