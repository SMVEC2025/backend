// /pages/api/accept-room.js

import supabase from '@/lib/supabase';
import cors from '@/lib/cors';
await cors(req, res); // Enable CORS

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
  res.status(405).json({ message: 'Method not allowed' });
}