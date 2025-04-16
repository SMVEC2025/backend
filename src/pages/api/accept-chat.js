// pages/api/accept-chat.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // ✅ Add CORS headers early
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // or '*'
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Safe supabase client (no global imports)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { roomId } = req.body;

  const { data, error } = await supabase
    .from('rooms')
    .update({ accepted: true })
    .eq('id', roomId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Chat accepted', data });
}
