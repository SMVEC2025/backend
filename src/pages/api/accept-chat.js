// /pages/api/accept-room.js

import supabase from '@/lib/supabase';
import cors from '@/lib/cors';


   


export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // or '*'
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Now handle actual POST request
  if (req.method === 'POST') {
    // Your logic
    return res.status(200).json({ message: 'Chat accepted' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}