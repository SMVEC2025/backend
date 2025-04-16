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
  

  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}