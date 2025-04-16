// lib/cors.js

import Cors from 'cors';
import initMiddleware from './init-middleware';

// You can add more domains in origin array if needed
const cors = initMiddleware(
  Cors({
    origin: '*', // 👈 Allow all origins (unsafe for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

export default cors;

