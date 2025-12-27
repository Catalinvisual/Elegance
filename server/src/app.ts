import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// DOAR HEALTHCHECK - ATÂT!
app.get('/api/health', (req, res) => {
  console.log('🩺 HEALTHCHECK HIT!');
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Răspundem la root
app.get('/', (req, res) => {
  console.log('🌍 ROOT HIT!');
  res.json({ message: 'Server functional pe root!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER PORNIT PE PORT ${PORT}!`);
  console.log(`🌍 HOST: 0.0.0.0`);
  console.log(`💓 Healthcheck: http://0.0.0.0:${PORT}/api/health`);
});

export default app;