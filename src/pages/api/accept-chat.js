// /pages/api/accept-room.js

import supabase from '@/lib/supabase';
import cors from '@/lib/cors';

export default async function handler(req, res) {
  const allowedOrigins = ['http://localhost:5173', '*']; // Add your frontend domain here
  const origin = req.headers.origin;

  // Allow only whitelisted origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Respond to preflight
    return;
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { room_id,action } = req.body;

  if (!room_id) {
    return res.status(400).json({ error: 'room_id is required' });
  }

  try {
    // Check if room exists and is in pending status
    const { data: room, error: fetchError } = await supabase
      .from('room')
      .select('*')
      .eq('room_id', room_id)
      .eq('status', 'pending')
      .single();

    if (fetchError || !room) {
      return res.status(404).json({ error: 'Room not found or not pending' });
    }

    // Update room status to 'accept' and return updated row
    const { data: updatedRoom, error: updateError } = await supabase
      .from('room')
      .update({ status: action })
      .eq('room_id', room_id)
      .select()
      .single(); // to return single row instead of array

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    return res.status(200).json({
      message: 'Room accepted successfully',
      status: updatedRoom.status, // includes updated status
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}










export default function handler(req, res) {
  const allowedOrigins = ['http://localhost:5173', 'https://your-frontend.com']; // Add production domain too
  const origin = req.headers.origin;

  // Match and allow only approved origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // ✅ Replace this with your logic
    return res.status(200).json({ message: 'Chat accepted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}