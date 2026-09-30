// Vercel Serverless Function: /api/create-order
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const amount = data.amount || 299;

    return res.status(200).json({
      success: true,
      orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_algonexus',
      mode: process.env.RAZORPAY_KEY_ID ? 'live_razorpay' : 'direct_and_simulated'
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
