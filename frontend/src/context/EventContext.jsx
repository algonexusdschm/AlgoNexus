import React, { createContext, useContext, useState, useEffect } from 'react';
import { EVENT_DETAILS, REGISTRATION_TIERS, PAST_YEAR_GALLERY, EVENT_TRACKS } from '../data/eventData';

const EventContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'algonexus_settings',
  PAYMENT_SETTINGS: 'algonexus_payment_settings',
  TIERS: 'algonexus_tiers',
  REGISTRATIONS: 'algonexus_registrations',
  ADMIN_AUTH: 'algonexus_admin_logged_in',
  TEAM_MEMBERS: 'algonexus_team_members',
  CURRENT_ADMIN_USER: 'algonexus_current_admin_user',
  HEAD_PASSCODE: 'algonexus_head_passcode'
};

const DEFAULT_HEAD_PASSCODE = 'head2026';

const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'head-001',
    name: 'Event Head (Lead Organizer)',
    email: 'head@algonexus.fest',
    role: 'Event Head / Lead Organizer',
    passcode: 'head2026',
    isEventHead: true,
    permissions: ['all'],
    status: 'Active',
    addedAt: '2026-09-01'
  },
  {
    id: 'mem-001',
    name: 'Rahul Sharma',
    email: 'rahul.s@college.edu',
    role: 'Registration & Verification Lead',
    passcode: 'reg2026',
    isEventHead: false,
    permissions: ['registrations', 'checkin'],
    status: 'Active',
    addedAt: '2026-09-15'
  },
  {
    id: 'mem-002',
    name: 'Priya Patel',
    email: 'priya.p@college.edu',
    role: 'Finance & Bank Accounts Lead',
    passcode: 'finance2026',
    isEventHead: false,
    permissions: ['payment-bank', 'registrations'],
    status: 'Active',
    addedAt: '2026-09-18'
  }
];

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

  // 5. Admin Authentication & Role Management
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 6. Event Head Master Passcode
  const [headPasscode, setHeadPasscode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.HEAD_PASSCODE) || DEFAULT_HEAD_PASSCODE;
    } catch {
      return DEFAULT_HEAD_PASSCODE;
    }
  });

  // 7. Team Members List
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
      return saved ? JSON.parse(saved) : DEFAULT_TEAM_MEMBERS;
    } catch {
      return DEFAULT_TEAM_MEMBERS;
    }
  });

  // 8. Current Logged-in Admin User
  const [currentAdminUser, setCurrentAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
      if (saved) return JSON.parse(saved);
      // Fallback if already authenticated
      if (localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true') {
        return {
          name: 'Event Head (Lead Organizer)',
          role: 'Event Head / Lead Organizer',
          email: 'head@algonexus.fest',
          isEventHead: true,
          permissions: ['all']
        };
      }
      return null;
    } catch {
      return null;
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
    const trimmed = (password || '').trim();
    
    // 1. Check if Event Head (matches master passcode, 'admin123', 'head2026', or 'algonexus2026')
    if (trimmed === headPasscode || trimmed === 'admin123' || trimmed === 'head2026' || trimmed === 'algonexus2026') {
      const headUser = {
        id: 'head-001',
        name: 'Event Head (Lead Organizer)',
        role: 'Event Head / Lead Organizer',
        email: 'head@algonexus.fest',
        isEventHead: true,
        permissions: ['all']
      };
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(headUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, JSON.stringify(headUser));
      return { success: true, user: headUser };
    }

    // 2. Check if matches any active team member
    const matchedMember = teamMembers.find(m => m.status === 'Active' && m.passcode === trimmed);
    if (matchedMember) {
      const memberUser = {
        id: matchedMember.id,
        name: matchedMember.name,
        role: matchedMember.role,
        email: matchedMember.email,
        isEventHead: false,
        permissions: matchedMember.permissions || []
      };
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(memberUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, JSON.stringify(memberUser));
      return { success: true, user: memberUser };
    }

    return { 
      success: false, 
      error: 'Invalid Passcode! Enter Event Head master passcode or your assigned Member passcode.' 
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
  };

  // Team Member Management (Event Head exclusive)
  const addTeamMember = (memberData) => {
    const newMember = {
      id: 'mem-' + Date.now(),
      name: memberData.name,
      email: memberData.email || '',
      role: memberData.role || 'Committee Member',
      passcode: memberData.passcode || ('MEM-' + Math.floor(1000 + Math.random() * 9000)),
      isEventHead: false,
      permissions: memberData.permissions || ['registrations', 'checkin'],
      status: 'Active',
      addedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving team members:', e);
    }
    return newMember;
  };

  const updateTeamMember = (id, updatedFields) => {
    const updated = teamMembers.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setTeamMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating team member:', e);
    }
    return updated;
  };

  const removeTeamMember = (id) => {
    const memberToRemove = teamMembers.find(m => m.id === id);
    if (memberToRemove && memberToRemove.isEventHead) {
      return false; // Cannot delete Event Head
    }
    const updated = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error removing team member:', e);
    }
    return true;
  };

  const updateHeadPasscode = (newPasscode) => {
    const trimmed = (newPasscode || '').trim();
    if (!trimmed) return false;
    setHeadPasscode(trimmed);
    try {
      localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, trimmed);
    } catch (e) {}
    return true;
  };

  return (
    <EventContext.Provider value={{
      eventSettings,
      paymentSettings,
      pricingTiers,
      registrations,
      isAdminAuthenticated,
      currentAdminUser,
      headPasscode,
      teamMembers,
      updateEventSettings,
      updatePaymentSettings,
      updatePricingTiers,
      addRegistration,
      checkInAttendee,
      loginAdmin,
      logoutAdmin,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      updateHeadPasscode
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
