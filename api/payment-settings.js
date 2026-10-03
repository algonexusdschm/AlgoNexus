// Vercel Serverless Function: /api/payment-settings
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vcswkusqdkyhyanytjlc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjc3drdXNxZGt5aHlhbnl0amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDg1NjEsImV4cCI6MjEwNjQyNDU2MX0.2u2J3D3ef9YnqScgX0QjlWW8-cjsI0NXyfVt-ZheoA4';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'algonexus_admin_secret_key_2026';

let fallbackSettings = {
  upiId: '8010086323@fam',
  payeeName: 'Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
  qrCodeImage: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png',
  bankDetails: {
    bankName: 'Smt. Chandibai Himathmal Mansukhani College Account',
    accountNumber: '41829019283',
    ifscCode: 'SBIN0001234',
    accountHolder: 'Department of Data Science - AlgoNexus 2026',
    accountType: 'Current Account',
    branch: 'CHM College Campus Branch'
  },
  instructions: 'Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM). Enter 12-digit UTR and attach screenshot.'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/payment_settings?id=eq.1&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (response.ok) {
        const rows = await response.json();
        if (rows && rows.length > 0) {
          const row = rows[0];
          return res.status(200).json({
            upiId: row.upi_id || fallbackSettings.upiId,
            payeeName: row.payee_name || fallbackSettings.payeeName,
            qrCodeImage: row.qr_code_image || fallbackSettings.qrCodeImage,
            bankDetails: {
              bankName: row.bank_name || fallbackSettings.bankDetails.bankName,
              accountNumber: row.account_number || fallbackSettings.bankDetails.accountNumber,
              ifscCode: row.ifsc_code || fallbackSettings.bankDetails.ifscCode,
              accountHolder: row.account_holder || fallbackSettings.bankDetails.accountHolder,
              accountType: row.account_type || fallbackSettings.bankDetails.accountType,
              branch: row.branch || fallbackSettings.bankDetails.branch
            },
            instructions: row.instructions || fallbackSettings.instructions
          });
        }
      }
    } catch (err) {
      console.warn('Supabase fetch notice in api/payment-settings:', err);
    }

    return res.status(200).json(fallbackSettings);
  }

  if (req.method === 'POST') {
    // Security check: Protect payment settings updates with admin token
    const token = req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token || token !== ADMIN_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required to modify payment settings' });
    }

    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      fallbackSettings = {
        ...fallbackSettings,
        ...data,
        bankDetails: {
          ...fallbackSettings.bankDetails,
          ...(data.bankDetails || {})
        }
      };

      // Persist to Supabase PostgreSQL
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/payment_settings?on_conflict=id`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: 1,
            upi_id: fallbackSettings.upiId,
            payee_name: fallbackSettings.payeeName,
            qr_code_image: fallbackSettings.qrCodeImage,
            bank_name: fallbackSettings.bankDetails.bankName,
            account_number: fallbackSettings.bankDetails.accountNumber,
            ifsc_code: fallbackSettings.bankDetails.ifscCode,
            account_holder: fallbackSettings.bankDetails.accountHolder,
            account_type: fallbackSettings.bankDetails.accountType,
            branch: fallbackSettings.bankDetails.branch,
            instructions: fallbackSettings.instructions,
            updated_at: new Date().toISOString()
          })
        });
      } catch (cloudErr) {
        console.warn('Could not persist to Supabase from serverless function:', cloudErr);
      }

      return res.status(200).json({ success: true, settings: fallbackSettings });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
