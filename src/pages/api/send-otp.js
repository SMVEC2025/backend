import nodemailer from 'nodemailer'
import supabase from '@/lib/supabase'
import cors from '@/lib/cors';

export default async function handler(req, res) {

    await cors(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

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
}