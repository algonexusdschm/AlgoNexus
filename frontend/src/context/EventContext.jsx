import React, { createContext, useContext, useState, useEffect } from 'react';
import { EVENT_DETAILS, REGISTRATION_TIERS, PAST_YEAR_GALLERY, EVENT_TRACKS } from '../data/eventData';

const EventContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'algonexus_settings',
  PAYMENT_SETTINGS: 'algonexus_payment_settings',
  TIERS: 'algonexus_tiers',
  REGISTRATIONS: 'algonexus_registrations',
  ADMIN_AUTH: 'algonexus_admin_logged_in'
};

const DEFAULT_PAYMENT_SETTINGS = {
  upiId: 'algonexus.fest@oksbi',
  payeeName: 'AlgoNexus 2026 Organizing Committee',
  qrCodeImage: '',
  bankDetails: {
    bankName: 'State Bank of India',
    accountNumber: '41829019283',
    ifscCode: 'SBIN0001234',
    accountHolder: 'AlgoNexus 2026 Student Council',
    accountType: 'Current Account',
    branch: 'College Campus Branch'
  },
  instructions: 'Scan using Google Pay, PhonePe, Paytm, or BHIM. Enter the 12-digit UTR/Reference ID and attach your payment receipt screenshot.'
};

export function EventProvider({ children }) {
  // 1. Event General Settings
  const [eventSettings, setEventSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : EVENT_DETAILS;
    } catch {
      return EVENT_DETAILS;
    }
  });

  // 2. Payment & Bank & QR Settings
  const [paymentSettings, setPaymentSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  // 3. Pricing Tiers
  const [pricingTiers, setPricingTiers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIERS);
      return saved ? JSON.parse(saved) : REGISTRATION_TIERS;
    } catch {
      return REGISTRATION_TIERS;
    }
  });

  // 4. Registrations List
  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Admin Authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Fetch initial data from backend if available, fallback to localStorage
  useEffect(() => {
    // Fetch payment settings
    fetch('/api/payment-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.upiId) {
          setPaymentSettings(prev => {
            const merged = { ...prev, ...data };
            localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});

    // Fetch registrations
    fetch('/api/registrations')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.registrations && data.registrations.length > 0) {
          setRegistrations(data.registrations);
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(data.registrations));
        }
      })
      .catch(() => {});
  }, []);

  // Sync to localStorage whenever state changes
  const updatePaymentSettings = async (newSettings) => {
    const updated = {
      ...paymentSettings,
      ...newSettings,
      bankDetails: {
        ...paymentSettings.bankDetails,
        ...(newSettings.bankDetails || {})
      }
    };
    setPaymentSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit reached for payment settings:', e);
    }

    // Attempt API update
    try {
      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Backend sync failed, using localStorage persist:', err);
    }
    return updated;
  };

  const updateEventSettings = (newSettings) => {
    const updated = { ...eventSettings, ...newSettings };
    setEventSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return updated;
  };

  const updatePricingTiers = (newTiers) => {
    setPricingTiers(newTiers);
    try {
      localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(newTiers));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return newTiers;
  };

  const addRegistration = async (registration) => {
    const updated = [registration, ...registrations];
    setRegistrations(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Also send to backend
    try {
      await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationData: registration.attendee,
          paymentMethod: registration.paymentMethod,
          utrNumber: registration.utrNumber,
          paymentScreenshot: registration.paymentScreenshot,
          bankName: registration.bankName,
          isSimulated: true
        })
      });
    } catch (err) {
      console.warn('Backend sync failed:', err);
    }
    return registration;
  };

  const checkInAttendee = async (ticketId) => {
    const updated = registrations.map(reg => {
      if (reg.ticketId.toUpperCase() === ticketId.toUpperCase()) {
        return { ...reg, checkedIn: true, checkedInAt: new Date().toISOString() };
      }
      return reg;
    });
    setRegistrations(updated);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));

    try {
      await fetch(`/api/check-in/${ticketId}`, { method: 'POST' });
    } catch (e) {}
  };

  const loginAdmin = (password) => {
    // Default passcode is admin123
    if (password === 'admin123' || password === 'algonexus2026') {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  return (
    <EventContext.Provider value={{
      eventSettings,
      paymentSettings,
      pricingTiers,
      registrations,
      isAdminAuthenticated,
      updateEventSettings,
      updatePaymentSettings,
      updatePricingTiers,
      addRegistration,
      checkInAttendee,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
