// pages/api/create-room.js
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://smvhospitals.com',
  'https://smvhospital.vercel.app',
  '*'
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // ✅ Generate unique room ID
    const roomId = uuidv4();

    // ✅ Insert room data into 'room' table
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          room_id: roomId,
          name,
          email,
          content:'Hello! how can i help you today?',
          sender_type:'agent'
        },
      ]);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to create room record' });
    }

    // 🎉 All good
    return res.status(200).json({
      success: true,
      message: 'Room created successfully',
      roomId,
    });
  }
}
