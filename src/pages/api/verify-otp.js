// pages/api/verify-otp.js
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



    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'Missing fields' })
    
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !data) return res.status(400).json({ error: 'OTP not found' })
    
    const now = new Date()
    const expiry = new Date(data.expires_at)
    
    if (data.otp === otp && now < expiry) {
      // ✅ Generate unique room ID
      const roomId = uuidv4()
    
      // ✅ Store roomId in the OTP record
      const { error: updateError } = await supabase
        .from('otps')
        .update({ room_id: roomId }) // <-- make sure this column exists
        .eq('email', email)
    
      if (updateError) {
        return res.status(500).json({ error: 'Failed to save room ID' })
      }
    
      // ✅ Create new room entry for agent to accept
      const { error: insertError } = await supabase
        .from('room')
        .insert([
          {
            email,
            room_id: roomId,
            status: 'pending', // initial status
          },
        ])
    
      if (insertError) {
          console.log(insertError)
        return res.status(500).json({ error: 'Failed to create room record' })
      }
    
      // 🎉 All good
      return res.status(200).json({
        success: true,
        message: 'OTP verified, room created',
        roomId: roomId,
      })
    
    } else {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' })
    }




  }
}










