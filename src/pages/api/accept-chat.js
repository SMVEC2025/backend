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