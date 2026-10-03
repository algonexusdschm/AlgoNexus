const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow base64 uploads for QR codes & payment screenshots
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Persistent data directory
const DATA_DIR = path.join(__dirname, 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
}

// Default payment settings
const defaultSettings = {
  upiId: 'algonexus.fest@oksbi',
  payeeName: 'AlgoNexus 2026 Organizing Committee',
  qrCodeImage: '', // Custom uploaded GPay / PhonePe QR code (data URL or relative path)
  instructions: 'Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM, Cred). Enter the 12-digit UTR / Transaction ID and attach screenshot to verify.'
};

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
}

function readRegistrations() {
  try {
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading registrations:', err);
    return [];
  }
}

function saveRegistration(reg) {
  const list = readRegistrations();
  list.unshift(reg);
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(list, null, 2));
  return reg;
}

function readSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  return settings;
}

// Check Razorpay Configuration
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
const isRealRazorpay = keyId && keySecret && !keyId.includes('placeholder') && !keySecret.includes('placeholder');
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'algonexus_admin_secret_key_2026';

// Admin authentication middleware
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!token || token !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin token required to perform this action' });
  }
  next();
}

let razorpayInstance = null;
if (isRealRazorpay) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay initialized with provided API credentials');
  } catch (err) {
    console.warn('⚠️ Could not initialize Razorpay SDK with keys:', err.message);
  }
}

// 1. Health check & Config Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', event: 'AlgoNexus 2026 API', timestamp: new Date().toISOString() });
});

app.get('/api/config', (req, res) => {
  res.json({
    keyId: isRealRazorpay ? keyId : 'rzp_test_mock_algonexus',
    isLiveRazorpay: Boolean(razorpayInstance),
    currency: 'INR'
  });
});

// 2. Payment & QR Settings Endpoints
app.get('/api/payment-settings', (req, res) => {
  const settings = readSettings();
  res.json(settings);
});

app.post('/api/payment-settings', requireAdmin, (req, res) => {
  try {
    const { upiId, payeeName, qrCodeImage, instructions } = req.body;
    const current = readSettings();
    const updated = {
      upiId: upiId !== undefined ? upiId : current.upiId,
      payeeName: payeeName !== undefined ? payeeName : current.payeeName,
      qrCodeImage: qrCodeImage !== undefined ? qrCodeImage : current.qrCodeImage,
      instructions: instructions !== undefined ? instructions : current.instructions
    };
    saveSettings(updated);
    res.json({ success: true, message: 'Payment settings updated successfully', settings: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment settings' });
  }
});

// 3. Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, passType, attendeeName, email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (razorpayInstance) {
      const options = {
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt: receiptId,
        notes: {
          event: 'AlgoNexus 2026',
          passType: passType || 'General',
          attendeeName: attendeeName || 'Participant',
          email: email || ''
        }
      };

      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        mode: 'live_razorpay'
      });
    }

    // Direct / Simulation Order
    const mockOrder = {
      success: true,
      orderId: `order_alg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: 'rzp_test_mock_algonexus',
      mode: 'direct_and_simulated',
      message: 'Order created for checkout'
    };

    return res.json(mockOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// 4. Verify Payment & Confirm Registration
app.post('/api/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData,
      paymentMethod, // 'UPI_QR', 'NET_BANKING', 'CARD', 'RAZORPAY_POPUP'
      utrNumber,
      paymentScreenshot,
      bankName,
      isSimulated
    } = req.body;

    let isAuthentic = true;

    if (razorpayInstance && !isSimulated && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isAuthentic = generatedSignature === razorpay_signature;
      if (!isAuthentic) {
        return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
      }
    }

    // Only real signed Razorpay transactions are marked PAID automatically.
    // Manual UPI / Netbanking transfers are queued as PENDING_VERIFICATION until organizer approval.
    const isVerifiedByGateway = Boolean(razorpayInstance && !isSimulated && razorpay_signature && isAuthentic);
    const paymentStatus = isVerifiedByGateway ? 'PAID' : 'PENDING_VERIFICATION';

    // Generate unique Ticket ID
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `ALGO26-${randomCode}`;

    const newRegistration = {
      ticketId,
      orderId: razorpay_order_id || `ORD-${Date.now()}`,
      paymentId: razorpay_payment_id || utrNumber || `PAY-${Date.now()}`,
      paymentStatus,
      paymentMethod: paymentMethod || 'UPI_QR',
      utrNumber: utrNumber || '',
      paymentScreenshot: paymentScreenshot || '',
      bankName: bankName || '',
      paymentMode: paymentMethod || 'DIRECT_PAYMENT',
      verifiedAt: isVerifiedByGateway ? new Date().toISOString() : null,
      submittedAt: new Date().toISOString(),
      amountPaid: registrationData.amount,
      passType: registrationData.passType,
      attendee: {
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        college: registrationData.college,
        branch: registrationData.branch,
        year: registrationData.year,
        github: registrationData.github || '',
        track: registrationData.track || 'General',
        teamName: registrationData.teamName || '',
        teamMembers: registrationData.teamMembers || []
      },
      checkedIn: false
    };

    saveRegistration(newRegistration);

    res.json({
      success: true,
      message: isVerifiedByGateway 
        ? 'Registration and Payment confirmed!' 
        : 'Registration submitted! Payment reference queued for verification.',
      ticket: newRegistration
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Verification error', details: error.message });
  }
});

// 5. Admin - Get All Registrations (Protected)
app.get('/api/registrations', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  res.json({
    count: registrations.length,
    registrations
  });
});

// 6. Check-in Gate Scanner Verification (Protected)
app.get('/api/registrations/:ticketId', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  const ticket = registrations.find(r => r.ticketId.toUpperCase() === req.params.ticketId.toUpperCase());
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json(ticket);
});

// 7. Verify / Approve Pending Registration Payment (Protected)
app.patch('/api/registrations/:ticketId/verify', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  const index = registrations.findIndex(r => r.ticketId.toUpperCase() === req.params.ticketId.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  registrations[index].paymentStatus = 'PAID';
  registrations[index].verifiedAt = new Date().toISOString();
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));

  res.json({ 
    success: true, 
    message: `Payment verified and confirmed for ticket ${req.params.ticketId}!`, 
    ticket: registrations[index] 
  });
});

app.post('/api/check-in/:ticketId', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  const index = registrations.findIndex(r => r.ticketId.toUpperCase() === req.params.ticketId.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (registrations[index].checkedIn) {
    return res.status(400).json({ error: 'Already checked in', checkedInAt: registrations[index].checkedInAt });
  }

  registrations[index].checkedIn = true;
  registrations[index].checkedInAt = new Date().toISOString();
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));

  res.json({ success: true, message: 'Attendee checked in successfully!', ticket: registrations[index] });
});

// Serve static assets from frontend build if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 AlgoNexus Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints ready with UPI, QR, NetBanking, and Razorpay.`);
});
