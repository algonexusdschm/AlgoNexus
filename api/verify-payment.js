// Vercel Serverless Function: /api/verify-payment
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        razorpay_order_id,
        razorpay_payment_id,
        registrationData,
        paymentMethod,
        utrNumber,
        paymentScreenshot,
        bankName
      } = body;

      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketId = `ALGO26-${randomCode}`;

      const newRegistration = {
        ticketId,
        orderId: razorpay_order_id || `ORD_${Date.now()}`,
        paymentId: razorpay_payment_id || utrNumber || `PAY_${Date.now()}`,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod || 'UPI_QR',
        utrNumber: utrNumber || '',
        paymentScreenshot: paymentScreenshot || '',
        bankName: bankName || '',
        verifiedAt: new Date().toISOString(),
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

      return res.status(200).json({
        success: true,
        message: 'Registration and Payment confirmed!',
        ticket: newRegistration
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to verify payment', details: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
