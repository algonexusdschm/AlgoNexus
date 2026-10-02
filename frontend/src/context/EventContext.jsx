import React, { createContext, useContext, useState, useEffect } from 'react';
import { EVENT_DETAILS, REGISTRATION_TIERS, PAST_YEAR_GALLERY, EVENT_TRACKS } from '../data/eventData';
import { supabase, uploadImageToSupabase } from '../lib/supabaseClient';

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
    name: 'Department of Data Science - Event Head',
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
  upiId: '8010086323@okbizaxis',
  payeeName: 'Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
  qrCodeImage: '',
  bankDetails: {
    bankName: 'Smt. Chandibai Himathmal Mansukhani College Account',
    accountNumber: '41829019283',
    ifscCode: 'SBIN0001234',
    accountHolder: 'Department of Data Science - AlgoNexus 2026',
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

  // Fetch initial data from Supabase Cloud (with fallback to local API / localStorage)
  useEffect(() => {
    // 1. Fetch Payment & Bank Settings from Supabase
    supabase
      .from('payment_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data && !error) {
          const merged = {
            upiId: data.upi_id || paymentSettings.upiId,
            payeeName: data.payee_name || paymentSettings.payeeName,
            qrCodeImage: data.qr_code_image !== undefined && data.qr_code_image !== null ? data.qr_code_image : paymentSettings.qrCodeImage,
            bankDetails: {
              bankName: data.bank_name || paymentSettings.bankDetails?.bankName,
              accountNumber: data.account_number || paymentSettings.bankDetails?.accountNumber,
              ifscCode: data.ifsc_code || paymentSettings.bankDetails?.ifscCode,
              accountHolder: data.account_holder || paymentSettings.bankDetails?.accountHolder,
              accountType: data.account_type || paymentSettings.bankDetails?.accountType,
              branch: data.branch || paymentSettings.bankDetails?.branch
            },
            instructions: data.instructions || paymentSettings.instructions
          };
          setPaymentSettings(merged);
          localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(merged));
        } else {
          // Fallback to local /api/payment-settings
          fetch('/api/payment-settings')
            .then(res => res.ok ? res.json() : null)
            .then(d => {
              if (d && d.upiId) {
                setPaymentSettings(prev => ({ ...prev, ...d }));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    // Realtime channel to sync payment settings instantly across all devices/browsers
    const paymentChannel = supabase
      .channel('payment_settings_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_settings' },
        (payload) => {
          if (payload.new) {
            const data = payload.new;
            setPaymentSettings(prev => {
              const updated = {
                ...prev,
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
              localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(updated));
              return updated;
            });
          }
        }
      )
      .subscribe();

    // 2. Fetch Event Settings from Supabase
    supabase
      .from('event_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data && !error) {
          const isAnnounced = data.dates && !data.dates.toLowerCase().includes('soon') && !data.dates.toLowerCase().includes('tba');
          const mapped = {
            ...eventSettings,
            name: data.name || eventSettings.name,
            tagline: data.tagline || eventSettings.tagline,
            dates: data.dates || eventSettings.dates,
            datesAnnounced: isAnnounced,
            targetDate: data.target_date || eventSettings.targetDate,
            venue: data.venue || eventSettings.venue,
            prizePool: data.prize_pool || eventSettings.prizePool
          };
          setEventSettings(mapped);
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mapped));
        }
      })
      .catch(() => {});

    // Realtime channel to sync event dates and announcement status across all devices
    const eventChannel = supabase
      .channel('event_settings_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'event_settings' },
        (payload) => {
          if (payload.new) {
            const data = payload.new;
            const isAnnounced = data.dates && !data.dates.toLowerCase().includes('soon') && !data.dates.toLowerCase().includes('tba');
            setEventSettings(prev => {
              const updated = {
                ...prev,
                name: data.name || prev.name,
                tagline: data.tagline || prev.tagline,
                dates: data.dates || prev.dates,
                datesAnnounced: isAnnounced,
                targetDate: data.target_date || prev.targetDate,
                venue: data.venue || prev.venue,
                prizePool: data.prize_pool || prev.prizePool
              };
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
              return updated;
            });
          }
        }
      )
      .subscribe();

    // 3. Fetch Registrations from Supabase
    supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data && !error && data.length > 0) {
          const mapped = data.map(r => ({
            id: r.id,
            ticketId: r.ticket_id,
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
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(mapped));
        } else {
          // Fallback to local /api/registrations
          fetch('/api/registrations')
            .then(res => res.ok ? res.json() : null)
            .then(d => {
              if (d && d.registrations && d.registrations.length > 0) {
                setRegistrations(d.registrations);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    // 4. Fetch Committee Members from Supabase
    supabase
      .from('team_members')
      .select('*')
      .then(({ data, error }) => {
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
          localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(mapped));
        }
      })
      .catch(() => {});

    return () => {
      supabase.removeChannel(paymentChannel);
      supabase.removeChannel(eventChannel);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {}

    return updated;
  };

  const updateEventSettings = async (newSettings) => {
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

    // Sync to Supabase
    try {
      await supabase.from('event_settings').upsert({
        id: 1,
        name: updated.name,
        tagline: updated.tagline,
        dates: updated.dates,
        target_date: updated.datesAnnounced ? (updated.targetDate || '') : '',
        venue: updated.venue,
        prize_pool: updated.prizePool,
        updated_at: new Date().toISOString()
      });
    } catch (err) {}

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
        amount: registrationToSave.tier?.price || 299,
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
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));

    // Update in Supabase
    try {
      await supabase
        .from('registrations')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('ticket_id', ticketId);
    } catch (e) {}

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
