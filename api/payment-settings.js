// Vercel Serverless Function: /api/payment-settings
let inMemorySettings = {
  upiId: 'algonexus.fest@oksbi',
  payeeName: 'AlgoNexus 2026 Organizing Committee',
  qrCodeImage: '',
  bankDetails: {
    bankName: 'State Bank of India',
    accountNumber: '41829019283',
    ifscCode: 'SBIN0001234',
    accountHolder: 'AlgoNexus 2026 Student Council',
    accountType: 'Current Account',
    branch: 'Campus Main Branch'
  },
  instructions: 'Scan using Google Pay, PhonePe, Paytm, or BHIM. Enter the 12-digit UTR/Reference ID and attach your payment receipt screenshot.'
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inMemorySettings);
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      inMemorySettings = {
        ...inMemorySettings,
        ...data,
        bankDetails: {
          ...inMemorySettings.bankDetails,
          ...(data.bankDetails || {})
        }
      };
      return res.status(200).json({ success: true, settings: inMemorySettings });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
