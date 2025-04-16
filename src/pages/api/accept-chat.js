// /pages/api/accept-room.js

import supabase from '@/lib/supabase';
import cors from '@/lib/cors';

export default async function handler(req, res) {
  await cors(req, res); // Enable CORS

  if (req.method === 'POST') {
    // Your logic here
    res.status(200).json({ message: 'Chat accepted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
