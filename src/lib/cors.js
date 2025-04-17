// lib/cors.js
import Cors from 'cors';
import initMiddleware from './init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
    credentials: true,
  })
);

export default cors;