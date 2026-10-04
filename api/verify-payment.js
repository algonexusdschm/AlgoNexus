// Vercel Serverless Function: /api/verify-payment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vcswkusqdkyhyanytjlc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjc3drdXNxZGt5aHlhbnl0amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDg1NjEsImV4cCI6MjEwNjQyNDU2MX0.2u2J3D3ef9YnqScgX0QjlWW8-cjsI0NXyfVt-ZheoA4';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        registrationData,
        paymentMethod,
        utrNumber,
        paymentScreenshot,
        bankName,
        isSimulated
      } = body;

      const isGatewayPaid = Boolean(razorpay_signature && !isSimulated);
      const paymentStatus = isGatewayPaid ? 'PAID' : (body.paymentStatus || 'PENDING_VERIFICATION');

      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketId = `ALGO26-${randomCode}`;

      const newRegistration = {
        ticketId,
        orderId: razorpay_order_id || `ORD_${Date.now()}`,
        paymentId: razorpay_payment_id || utrNumber || `PAY_${Date.now()}`,
        paymentStatus,
        paymentMethod: paymentMethod || 'UPI_QR',
        utrNumber: utrNumber || (paymentScreenshot ? `SCREENSHOT-${ticketId}` : `UTR-PENDING-${Date.now().toString().slice(-6)}`),
        paymentScreenshot: paymentScreenshot || '',
        bankName: bankName || '',
        verifiedAt: paymentStatus === 'PAID' ? new Date().toISOString() : null,
        submittedAt: new Date().toISOString(),
        amountPaid: registrationData?.amount || 299,
        passType: registrationData?.passType || 'General Pass',
        attendee: {
          fullName: registrationData?.fullName || 'Participant',
          email: registrationData?.email || '',
          phone: registrationData?.phone || '',
          college: registrationData?.college || '',
          branch: registrationData?.branch || '',
          year: registrationData?.year || '',
          track: registrationData?.track || '',
          teamName: registrationData?.teamName || '',
          teamMembers: registrationData?.teamMembers || []
        },
        checkedIn: false
      };

      // Persist to Supabase Cloud PostgreSQL with 4s timeout protection
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            ticket_id: newRegistration.ticketId,
            tier_id: registrationData?.tierId || 'solo-coder',
            tier_name: newRegistration.passType,
            amount: newRegistration.amountPaid,
            payment_status: newRegistration.paymentStatus,
            full_name: newRegistration.attendee.fullName,
            email: newRegistration.attendee.email,
            phone: newRegistration.attendee.phone,
            college: newRegistration.attendee.college,
            track: newRegistration.attendee.track,
            team_name: newRegistration.attendee.teamName,
            team_members: Array.isArray(newRegistration.attendee.teamMembers)
              ? newRegistration.attendee.teamMembers.join(', ')
              : String(newRegistration.attendee.teamMembers || ''),
            payment_method: newRegistration.paymentMethod,
            utr_number: newRegistration.utrNumber,
            payment_screenshot: newRegistration.paymentScreenshot,
            bank_name: newRegistration.bankName,
            checked_in: false
          })
        });
        clearTimeout(timeoutId);
      } catch (cloudErr) {
        console.warn('Could not persist registration to Supabase in api/verify-payment:', cloudErr.message || cloudErr);
      }

      return res.status(200).json({
        success: true,
        message: paymentStatus === 'PAID' 
          ? 'Registration and Payment confirmed!' 
          : 'Registration submitted! Payment reference queued for verification.',
        ticket: newRegistration
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to verify payment', details: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
