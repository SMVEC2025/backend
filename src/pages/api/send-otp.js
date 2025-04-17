import nodemailer from 'nodemailer'
// import supabase from '@/lib/supabase'
// import cors from '@/lib/cors';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://smvserver.vercel.app',
  'https://your-frontend-domain.com'
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



    const { email } = req.body

    if (!email) return res.status(400).json({ error: 'Email is required' })
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  
    try {
      await supabase.from('otps').upsert({ email, otp, expires_at: expiresAt })
  
      await transporter.sendMail({
        from: `"SMV Hospital" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
      })
  
      res.status(200).json({ message: 'OTP sent' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to send OTP' })
    }







  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}






