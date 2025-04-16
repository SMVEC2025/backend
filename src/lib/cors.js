// lib/cors.js

import Cors from 'cors';
import initMiddleware from './init-middleware';

// You can add more domains in origin array if needed
const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

export default cors;

