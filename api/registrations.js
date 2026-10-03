// Vercel Serverless Function: /api/registrations (Protected)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vcswkusqdkyhyanytjlc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjc3drdXNxZGt5aHlhbnl0amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDg1NjEsImV4cCI6MjEwNjQyNDU2MX0.2u2J3D3ef9YnqScgX0QjlWW8-cjsI0NXyfVt-ZheoA4';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'algonexus_admin_secret_key_2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security check: Require admin token to access registrations
  const token = req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!token || token !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          count: data.length,
          registrations: data
        });
      }
    } catch (err) {
      console.warn('Supabase fetch error in api/registrations:', err);
    }

    return res.status(200).json({
      count: 0,
      registrations: []
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
