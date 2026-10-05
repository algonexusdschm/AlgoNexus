import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { EVENT_DETAILS, REGISTRATION_TIERS, PAST_YEAR_GALLERY, EVENT_TRACKS } from '../data/eventData';
import { supabase, uploadImageToSupabase } from '../lib/supabaseClient';

const EventContext = createContext();

const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'algonexus_admin_secret_key_2026';
const getAdminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': ADMIN_API_KEY
});

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
    name: 'Club Data Decoder / Department of Data Science - Event Head',
    email: 'algonexusdschm@gmail.com',
    role: 'Event Head / Lead Organizer',
    passcode: 'head2026',
    isEventHead: true,
    permissions: ['all'],
    status: 'Active',
    addedAt: '2026-09-01'
  },
  {
    id: 'mem-001',
    name: 'Student & Faculty Coordinators',
    email: 'algonexusdschm@gmail.com',
    role: 'Registration & Verification Lead',
    passcode: 'reg2026',
    isEventHead: false,
    permissions: ['registrations', 'checkin'],
    status: 'Active',
    addedAt: '2026-09-15'
  },
  {
    id: 'mem-002',
    name: 'Finance & Accounts Desk',
    email: 'algonexusdschm@gmail.com',
    role: 'Finance & Bank Accounts Lead',
    passcode: 'finance2026',
    isEventHead: false,
    permissions: ['payment-bank', 'registrations'],
    status: 'Active',
    addedAt: '2026-09-18'
  }
];

const DEFAULT_PAYMENT_SETTINGS = {
  upiId: '8010086323@fam',
  payeeName: 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
  qrCodeImage: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png',
  bankDetails: {
    bankName: 'Smt. Chandibai Himathmal Mansukhani College Account',
    accountNumber: '41829019283',
    ifscCode: 'SBIN0001234',
    accountHolder: 'Club Data Decoder / Department of Data Science - AlgoNexus 2026',
    accountType: 'Current Account',
    branch: 'CHM College Campus Branch'
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
          name: 'Department of Data Science - Event Head',
          role: 'Event Head / Lead Organizer',
          email: 'algonexusdschm@gmail.com',
          isEventHead: true,
          permissions: ['all']
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Shared Broadcast Channel reference for instant cross-device/browser sync
  const syncChannelRef = useRef(null);

  const broadcastChange = (event, payload = {}) => {
    try {
      if (syncChannelRef.current) {
        syncChannelRef.current.send({
          type: 'broadcast',
          event,
          payload
        });
      }
    } catch (err) {
      console.warn('Live sync broadcast notice:', err);
    }
  };

  // 1. Fetch & Sync Payment & Bank Settings from Supabase
  const syncPaymentSettingsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data && !error) {
        setPaymentSettings(prev => {
          const merged = {
            upiId: data.upi_id || prev.upiId,
            payeeName: data.payee_name || prev.payeeName,
            qrCodeImage: data.qr_code_image !== undefined && data.qr_code_image !== null ? data.qr_code_image : prev.qrCodeImage,
            bankDetails: {
              bankName: data.bank_name || prev.bankDetails?.bankName,
              accountNumber: data.account_number || prev.bankDetails?.accountNumber,
              ifscCode: data.ifsc_code || prev.bankDetails?.ifscCode,
              accountHolder: data.account_holder || prev.bankDetails?.accountHolder,
              accountType: data.account_type || prev.bankDetails?.accountType,
              branch: data.branch || prev.bankDetails?.branch
            },
            instructions: data.instructions || prev.instructions
          };
          try {
            localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    } catch (err) {}
  };

  // 2. Fetch & Sync Event Settings, Edition Tag and Pass Pricing from Supabase
  const syncEventSettingsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data && !error) {
        let rawTagline = data.tagline || '';
        let parsedTagline = rawTagline;
        let parsedEdition = '4th National Edition';
        let parsedPrices = null;

        // Parse :::prices::: from tagline
        if (parsedTagline.includes(':::prices:::')) {
          const priceParts = parsedTagline.split(':::prices:::');
          parsedTagline = priceParts[0];
          try {
            parsedPrices = JSON.parse(priceParts[1]);
          } catch (e) {
            console.warn('Could not parse cloud prices JSON:', e);
          }
        }

        // Parse :::edition::: from tagline
        if (parsedTagline.includes(':::edition:::')) {
          const parts = parsedTagline.split(':::edition:::');
          parsedTagline = parts[0];
          parsedEdition = parts[1] || '4th National Edition';
        }

        const isAnnounced = Boolean(data.dates && !data.dates.toLowerCase().includes('soon') && !data.dates.toLowerCase().includes('tba'));

        setEventSettings(prev => {
          const mapped = {
            ...prev,
            name: (data.name !== null && data.name !== undefined && data.name !== '') ? data.name : prev.name,
            tagline: parsedTagline,
            edition: parsedEdition,
            dates: (data.dates !== null && data.dates !== undefined && data.dates !== '') ? data.dates : prev.dates,
            datesAnnounced: isAnnounced,
            targetDate: (data.target_date !== null && data.target_date !== undefined) ? data.target_date : prev.targetDate,
            venue: (data.venue !== null && data.venue !== undefined && data.venue !== '') ? data.venue : prev.venue,
            prizePool: (data.prize_pool !== null && data.prize_pool !== undefined && data.prize_pool !== '') ? data.prize_pool : prev.prizePool
          };
          try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mapped));
          } catch (e) {}
          return mapped;
        });

        // Sync Pass Prices across all devices
        if (parsedPrices && typeof parsedPrices === 'object') {
          setPricingTiers(prev => {
            const updated = prev.map(t => {
              if (parsedPrices[t.id] !== undefined) {
                return { ...t, price: Number(parsedPrices[t.id]) };
              }
              return t;
            });
            try {
              localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      }
    } catch (err) {}
  };

  // 3. Fetch & Sync Committee Members & Passcodes from Supabase
  const syncTeamMembersFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('added_at', { ascending: true });

      if (data && !error && data.length > 0) {
        const mapped = data.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email || '',
          role: m.role,
          passcode: m.passcode,
          isEventHead: m.is_event_head || false,
          permissions: m.permissions || ['registrations', 'checkin'],
          status: m.status || 'Active',
          addedAt: m.added_at ? m.added_at.split('T')[0] : '2026'
        }));
        setTeamMembers(mapped);
        try {
          localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(mapped));
        } catch (e) {}

        const headMember = mapped.find(m => m.isEventHead || m.id === 'head-001');
        if (headMember && headMember.passcode) {
          setHeadPasscode(headMember.passcode);
          try {
            localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, headMember.passcode);
          } catch (e) {}
        }
        return mapped;
      }
    } catch (err) {}
    return null;
  };

  // 4. Fetch & Sync Registrations from Supabase
  const syncRegistrationsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        const mapped = data.map(r => ({
          id: r.id,
          ticketId: r.ticket_id,
          amountPaid: Number(r.amount) || 299,
          passType: r.tier_name || 'Solo Coder Pass',
          paymentStatus: r.payment_status || 'PENDING_VERIFICATION',
          tier: { id: r.tier_id, name: r.tier_name, price: Number(r.amount) || 299 },
          attendee: {
            fullName: r.full_name,
            email: r.email,
            phone: r.phone,
            college: r.college,
            github: r.github || '',
            teamName: r.team_name || '',
            teamMembers: r.team_members ? r.team_members.split(', ') : [],
            track: r.track || 'General'
          },
          paymentMethod: r.payment_method,
          utrNumber: r.utr_number || '',
          paymentScreenshot: r.payment_screenshot || '',
          bankName: r.bank_name || '',
          checkedIn: r.checked_in || false,
          checkedInAt: r.checked_in_at || null,
          createdAt: r.created_at
        }));
        setRegistrations(mapped);
        try {
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(mapped));
        } catch (e) {}
      }
    } catch (err) {}
  };

  // Mount real-time broadcast channel, postgres changes, and window focus listeners
  useEffect(() => {
    // Initial fetch from cloud
    syncPaymentSettingsFromSupabase();
    syncEventSettingsFromSupabase();
    syncTeamMembersFromSupabase();
    syncRegistrationsFromSupabase();

    // 1. Supabase Broadcast Channel: Instant sub-second sync across all devices, links & tabs
    const broadcastChannel = supabase.channel('algonexus_live_sync', {
      config: { broadcast: { self: false } }
    });

    broadcastChannel
      .on('broadcast', { event: 'EVENT_SETTINGS_UPDATED' }, ({ payload }) => {
        if (payload) {
          setEventSettings(prev => {
            const merged = { ...prev, ...payload };
            try {
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .on('broadcast', { event: 'PAYMENT_SETTINGS_UPDATED' }, ({ payload }) => {
        if (payload) {
          setPaymentSettings(prev => {
            const merged = { ...prev, ...payload };
            try {
              localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .on('broadcast', { event: 'HEAD_PASSCODE_UPDATED' }, ({ payload }) => {
        if (payload?.passcode) {
          setHeadPasscode(payload.passcode);
          try {
            localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, payload.passcode);
          } catch (e) {}
          setTeamMembers(prev => {
            const updated = prev.map(m => (m.isEventHead || m.id === 'head-001') ? { ...m, passcode: payload.passcode } : m);
            try {
              localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      })
      .on('broadcast', { event: 'PRICING_TIERS_UPDATED' }, ({ payload }) => {
        if (payload && Array.isArray(payload)) {
          setPricingTiers(payload);
          try {
            localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(payload));
          } catch (e) {}
        }
      })
      .on('broadcast', { event: 'TEAM_UPDATED' }, () => {
        syncTeamMembersFromSupabase();
      })
      .on('broadcast', { event: 'REGISTRATIONS_UPDATED' }, () => {
        syncRegistrationsFromSupabase();
      })
      .subscribe();

    syncChannelRef.current = broadcastChannel;

    // 2. Fallback Postgres Changes channels
    const paymentChannel = supabase
      .channel('payment_settings_pg_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_settings' }, () => {
        syncPaymentSettingsFromSupabase();
      })
      .subscribe();

    const eventChannel = supabase
      .channel('event_settings_pg_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_settings' }, () => {
        syncEventSettingsFromSupabase();
      })
      .subscribe();

    const teamChannel = supabase
      .channel('team_members_pg_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        syncTeamMembersFromSupabase();
      })
      .subscribe();

    // 3. Tab Focus & Network Online Auto-Refresh
    // When switching tabs or unlocking a phone, immediately re-verify credentials & data from cloud
    const handleReSync = () => {
      syncPaymentSettingsFromSupabase();
      syncEventSettingsFromSupabase();
      syncTeamMembersFromSupabase();
      syncRegistrationsFromSupabase();
    };

    window.addEventListener('focus', handleReSync);
    window.addEventListener('online', handleReSync);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleReSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic background sync every 12 seconds
    const intervalId = setInterval(handleReSync, 12000);

    return () => {
      if (syncChannelRef.current) {
        supabase.removeChannel(syncChannelRef.current);
      }
      supabase.removeChannel(paymentChannel);
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(teamChannel);
      window.removeEventListener('focus', handleReSync);
      window.removeEventListener('online', handleReSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  // Sync Payment & Bank Settings (with Cloud QR upload)
  const updatePaymentSettings = async (newSettings) => {
    let finalQrImage = newSettings.qrCodeImage ?? paymentSettings.qrCodeImage;

    // Upload QR code to Supabase Storage if newly attached as a data URL
    if (finalQrImage && typeof finalQrImage === 'string' && finalQrImage.startsWith('data:')) {
      try {
        const uploadedUrl = await uploadImageToSupabase(finalQrImage, 'organizer-assets', 'qr-codes');
        if (uploadedUrl) finalQrImage = uploadedUrl;
      } catch (err) {
        console.warn('QR cloud storage upload notice:', err);
      }
    }

    const updated = {
      ...paymentSettings,
      ...newSettings,
      qrCodeImage: finalQrImage,
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

    // Broadcast immediately so phone, laptop & tablet update in real-time
    broadcastChange('PAYMENT_SETTINGS_UPDATED', updated);

    // 1. Sync to Supabase Cloud PostgreSQL
    try {
      await supabase.from('payment_settings').upsert({
        id: 1,
        upi_id: updated.upiId,
        payee_name: updated.payeeName,
        qr_code_image: updated.qrCodeImage,
        bank_name: updated.bankDetails?.bankName,
        account_number: updated.bankDetails?.accountNumber,
        ifsc_code: updated.bankDetails?.ifscCode,
        account_holder: updated.bankDetails?.accountHolder,
        account_type: updated.bankDetails?.accountType,
        branch: updated.bankDetails?.branch,
        instructions: updated.instructions,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase payment sync notice:', err);
    }

    // 2. Also send to local backend if available
    try {
      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated)
      });
    } catch (err) {}

    return updated;
  };

  const updateEventSettings = async (newSettings, optionalNewTiers = null) => {
    const updated = { ...eventSettings, ...newSettings };
    if (updated.datesAnnounced === false) {
      updated.dates = 'To Be Announced Soon';
    }
    setEventSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Broadcast immediately to all connected browsers/devices
    broadcastChange('EVENT_SETTINGS_UPDATED', updated);

    const activeTiers = optionalNewTiers || pricingTiers;
    const priceMap = {};
    if (Array.isArray(activeTiers)) {
      activeTiers.forEach(t => {
        if (t && t.id) priceMap[t.id] = Number(t.price);
      });
    }

    // Sync to Supabase Cloud with edition and pass prices encoded in tagline
    try {
      const payloadTagline = `${updated.tagline || ''}:::edition:::${updated.edition || '4th National Edition'}:::prices:::${JSON.stringify(priceMap)}`;
      await supabase.from('event_settings').upsert({
        id: 1,
        name: updated.name,
        tagline: payloadTagline,
        dates: updated.dates,
        target_date: updated.datesAnnounced ? (updated.targetDate || '') : '',
        venue: updated.venue,
        prize_pool: updated.prizePool,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase event_settings update error:', err);
    }

    return updated;
  };

  const updatePricingTiers = async (newTiers) => {
    setPricingTiers(newTiers);
    try {
      localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(newTiers));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 1. Broadcast immediately to all connected browsers/devices in real-time
    broadcastChange('PRICING_TIERS_UPDATED', newTiers);

    // 2. Persist pass pricing to Supabase Cloud event_settings
    try {
      const priceMap = {};
      if (Array.isArray(newTiers)) {
        newTiers.forEach(t => {
          if (t && t.id) priceMap[t.id] = Number(t.price);
        });
      }

      const payloadTagline = `${eventSettings.tagline || ''}:::edition:::${eventSettings.edition || '4th National Edition'}:::prices:::${JSON.stringify(priceMap)}`;
      await supabase.from('event_settings').upsert({
        id: 1,
        name: eventSettings.name,
        tagline: payloadTagline,
        dates: eventSettings.dates,
        target_date: eventSettings.datesAnnounced ? (eventSettings.targetDate || '') : '',
        venue: eventSettings.venue,
        prize_pool: eventSettings.prizePool,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase pricing tiers sync error:', err);
    }

    return newTiers;
  };

  // Add Registration with Cloud Receipt Upload
  const addRegistration = async (registration) => {
    let finalReceiptImage = registration.paymentScreenshot;

    // Upload receipt screenshot to Supabase Storage if newly attached
    if (finalReceiptImage && typeof finalReceiptImage === 'string' && finalReceiptImage.startsWith('data:')) {
      try {
        const uploadedUrl = await uploadImageToSupabase(finalReceiptImage, 'payment-receipts', 'receipts');
        if (uploadedUrl) finalReceiptImage = uploadedUrl;
      } catch (err) {
        console.warn('Receipt cloud storage upload notice:', err);
      }
    }

    const registrationToSave = {
      ...registration,
      paymentScreenshot: finalReceiptImage
    };

    const updated = [registrationToSave, ...registrations];
    setRegistrations(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 1. Insert into Supabase registrations table
    try {
      await supabase.from('registrations').insert({
        ticket_id: registrationToSave.ticketId,
        tier_id: registrationToSave.tier?.id || 'solo-coder',
        tier_name: registrationToSave.tier?.name || 'Solo Coder Pass',
        amount: registrationToSave.amountPaid || registrationToSave.tier?.price || 299,
        payment_status: registrationToSave.paymentStatus || 'PENDING_VERIFICATION',
        full_name: registrationToSave.attendee?.fullName || 'Student',
        email: registrationToSave.attendee?.email || '',
        phone: registrationToSave.attendee?.phone || '',
        college: registrationToSave.attendee?.college || '',
        github: registrationToSave.attendee?.github || '',
        team_name: registrationToSave.attendee?.teamName || '',
        team_members: Array.isArray(registrationToSave.attendee?.teamMembers)
          ? registrationToSave.attendee.teamMembers.join(', ')
          : (registrationToSave.attendee?.teamMembers || ''),
        track: registrationToSave.attendee?.track || 'General AI/Hack',
        payment_method: registrationToSave.paymentMethod || 'UPI QR',
        utr_number: registrationToSave.utrNumber || '',
        payment_screenshot: finalReceiptImage || '',
        bank_name: registrationToSave.bankName || '',
        checked_in: false
      });
    } catch (err) {
      console.warn('Supabase registration insert notice:', err);
    }

    // 2. Also send to local backend
    try {
      await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationData: registrationToSave.attendee,
          paymentMethod: registrationToSave.paymentMethod,
          utrNumber: registrationToSave.utrNumber,
          paymentScreenshot: finalReceiptImage,
          bankName: registrationToSave.bankName,
          isSimulated: true
        })
      });
    } catch (err) {}

    return registrationToSave;
  };

  // Gate Check-In synced with Supabase
  const checkInAttendee = async (ticketId) => {
    const updated = registrations.map(reg => {
      if (reg.ticketId.toUpperCase() === ticketId.toUpperCase()) {
        return { ...reg, checkedIn: true, checkedInAt: new Date().toISOString() };
      }
      return reg;
    });
    setRegistrations(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    } catch (e) {}

    // Update in Supabase
    try {
      await supabase
        .from('registrations')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('ticket_id', ticketId);
    } catch (e) {}

    try {
      await fetch(`/api/check-in/${ticketId}`, { 
        method: 'POST',
        headers: getAdminHeaders()
      });
    } catch (e) {}
  };

  // Verify & Approve Pending Registration Payment (Organizer Exclusive)
  const verifyRegistrationPayment = async (ticketId) => {
    const updated = registrations.map(reg => {
      if (reg.ticketId.toUpperCase() === ticketId.toUpperCase()) {
        return { ...reg, paymentStatus: 'PAID', verifiedAt: new Date().toISOString() };
      }
      return reg;
    });
    setRegistrations(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    } catch (e) {}

    // Update in Supabase
    try {
      await supabase
        .from('registrations')
        .update({ payment_status: 'PAID', verified_at: new Date().toISOString() })
        .eq('ticket_id', ticketId);
    } catch (e) {
      console.warn('Supabase verifyRegistrationPayment error:', e);
    }

    // Update in backend
    try {
      await fetch(`/api/registrations/${ticketId}/verify`, {
        method: 'PATCH',
        headers: getAdminHeaders()
      });
    } catch (e) {}

    // Broadcast change immediately to all tabs & screens
    broadcastChange('REGISTRATIONS_UPDATED');
    return true;
  };

  const loginAdmin = async (password) => {
    const trimmed = (password || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter a passcode.' };
    }

    // Always fetch latest team credentials directly from Supabase Cloud to ensure cross-device sync
    let activeHeadPass = headPasscode || DEFAULT_HEAD_PASSCODE;
    let activeMembers = teamMembers || DEFAULT_TEAM_MEMBERS;

    try {
      const { data: cloudMembers, error } = await supabase
        .from('team_members')
        .select('*')
        .order('added_at', { ascending: true });

      if (cloudMembers && !error && cloudMembers.length > 0) {
        const mapped = cloudMembers.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email || '',
          role: m.role,
          passcode: m.passcode,
          isEventHead: m.is_event_head || false,
          permissions: m.permissions || ['registrations', 'checkin'],
          status: m.status || 'Active',
          addedAt: m.added_at ? m.added_at.split('T')[0] : '2026'
        }));
        activeMembers = mapped;
        setTeamMembers(mapped);
        try {
          localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(mapped));
        } catch (e) {}

        const headMember = mapped.find(m => m.isEventHead || m.id === 'head-001');
        if (headMember && headMember.passcode) {
          activeHeadPass = headMember.passcode;
          setHeadPasscode(headMember.passcode);
          try {
            localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, headMember.passcode);
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Supabase cloud passcode check notice:', err);
    }

    // 1. Check if Event Head (matches active master passcode)
    if (trimmed === activeHeadPass) {
      const headUser = {
        id: 'head-001',
        name: 'Department of Data Science - Event Head',
        role: 'Event Head / Lead Organizer',
        email: 'algonexusdschm@gmail.com',
        isEventHead: true,
        permissions: ['all']
      };
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(headUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, JSON.stringify(headUser));
      return { success: true, user: headUser };
    }

    // 2. Check if matches any active committee member (excluding event head)
    const matchedMember = activeMembers.find(
      m => !m.isEventHead && m.id !== 'head-001' && m.status === 'Active' && m.passcode === trimmed
    );
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
      error: 'Invalid Passcode! Please check your credentials and try again.' 
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
  };

  // Team Member Management (Event Head exclusive - fully synced with Supabase)
  const addTeamMember = async (memberData) => {
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
      console.warn('Error saving team members locally:', e);
    }

    // Broadcast change immediately
    broadcastChange('TEAM_UPDATED');

    // Sync to Supabase Cloud so phone, laptop & tablet update immediately
    try {
      await supabase.from('team_members').insert([{
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        passcode: newMember.passcode,
        is_event_head: false,
        permissions: newMember.permissions,
        status: newMember.status
      }]);
    } catch (err) {
      console.warn('Supabase addTeamMember error:', err);
    }
    return newMember;
  };

  const updateTeamMember = async (id, updatedFields) => {
    const updated = teamMembers.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setTeamMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating team member locally:', e);
    }

    if (updatedFields.passcode && (updatedFields.isEventHead || id === 'head-001')) {
      setHeadPasscode(updatedFields.passcode);
      try {
        localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, updatedFields.passcode);
      } catch (e) {}
    }

    // Broadcast change immediately
    broadcastChange('TEAM_UPDATED');

    // Sync to Supabase Cloud
    try {
      const payload = {};
      if (updatedFields.name !== undefined) payload.name = updatedFields.name;
      if (updatedFields.email !== undefined) payload.email = updatedFields.email;
      if (updatedFields.role !== undefined) payload.role = updatedFields.role;
      if (updatedFields.passcode !== undefined) payload.passcode = updatedFields.passcode;
      if (updatedFields.status !== undefined) payload.status = updatedFields.status;
      if (updatedFields.permissions !== undefined) payload.permissions = updatedFields.permissions;
      await supabase.from('team_members').update(payload).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateTeamMember error:', err);
    }
    return updated;
  };

  const removeTeamMember = async (id) => {
    const memberToRemove = teamMembers.find(m => m.id === id);
    if (memberToRemove && memberToRemove.isEventHead) {
      return false; // Cannot delete Event Head
    }
    const updated = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error removing team member locally:', e);
    }

    // Broadcast change immediately
    broadcastChange('TEAM_UPDATED');

    // Sync to Supabase Cloud
    try {
      await supabase.from('team_members').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase removeTeamMember error:', err);
    }
    return true;
  };

  const updateHeadPasscode = async (newPasscode) => {
    const trimmed = (newPasscode || '').trim();
    if (!trimmed) return false;
    setHeadPasscode(trimmed);
    try {
      localStorage.setItem(STORAGE_KEYS.HEAD_PASSCODE, trimmed);
    } catch (e) {}

    // Update in local team members state
    setTeamMembers(prev => {
      const next = prev.map(m => (m.isEventHead || m.id === 'head-001') ? { ...m, passcode: trimmed } : m);
      try {
        localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Broadcast to other open tabs/devices immediately
    broadcastChange('HEAD_PASSCODE_UPDATED', { passcode: trimmed });

    // Persist to Supabase Cloud so all devices sync instantly
    try {
      await supabase
        .from('team_members')
        .update({ passcode: trimmed })
        .eq('is_event_head', true);
    } catch (err) {
      console.warn('Supabase updateHeadPasscode error:', err);
    }
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
      verifyRegistrationPayment,
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
