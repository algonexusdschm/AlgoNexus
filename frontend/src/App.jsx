import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HackathonTracks from './components/HackathonTracks';
import Announcement from './components/Announcement';
import Gallery from './components/Gallery';
import PricingSection from './components/PricingSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import TicketModal from './components/TicketModal';
import AdminPage from './components/AdminPage';
import MinecraftBackground from './components/MinecraftBackground';
import { EventProvider, useEvent } from './context/EventContext';

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
      <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 overflow-x-hidden">
        <MinecraftBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          <AdminPage onBackToWebsite={navigateToEvent} />
        </div>
      </div>
    );
  }

  // Public Event Website
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 3D Multiverse Incursion World Background */}
      <MinecraftBackground />

      {/* Top Navbar with Admin Portal Trigger */}
      <Navbar
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero Section */}
        <Hero onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* 2. Hackathon Arenas & Champions of Doomsday (Movie Characters) */}
        <HackathonTracks onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* 3. Official Announcement Section for This Year's Event */}
        <Announcement onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* 3. Photo Gallery of Last Year's Event with Lightbox */}
        <Gallery />

        {/* 4. Passes & Pricing Tiers with Razorpay & Bank checkout triggers */}
        <PricingSection onSelectTier={(tier) => handleOpenRegister(tier)} />

        {/* 5. FAQs */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Interactive Modals */}
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
