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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // handle preflight
  }


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


  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}