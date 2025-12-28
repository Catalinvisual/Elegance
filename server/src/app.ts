import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

console.log('🔥🔥🔥 RAILWAY DEBUG: APP.TS PORNIT! 🔥🔥🔥');
console.log('📅 Data:', new Date().toISOString());
console.log('🎯 PORT din process.env:', process.env.PORT);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🌐 HOST din process.env:', process.env.HOST);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

console.log('🚀 PORT final:', PORT);
console.log('🌐 HOST final:', HOST);
console.log('🔥 RAILWAY PORT REAL:', process.env.PORT || 'Folosim 8080 default');

// 🔥 VERIFICĂM DACĂ CLIENT-BUILD EXISTĂ
const clientBuildPath = path.join(__dirname, '..', 'client-build');
console.log('📁 Client build path absolut:', clientBuildPath);

try {
  const files = fs.readdirSync(clientBuildPath);
  console.log('📂 Fișiere găsite în client-build:', files);
  
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html există!');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    console.log('📄 Primele 200 caractere din index.html:', indexContent.substring(0, 200));
  } else {
    console.log('❌ index.html NU există!');
  }
} catch (error: any) {
  console.log('❌ EROARE la citirea client-build:', error.message);
  console.log('🔍 Verificăm directorul curent:', __dirname);
  
  // Încercăm și alte path-uri posibile
  const altPaths = [
    path.join(__dirname, 'client-build'),
    path.join(process.cwd(), 'client-build'),
    '/app/server/client-build',
    path.join(__dirname, '..', 'client-build')
  ];
  
  altPaths.forEach(altPath => {
    try {
      if (fs.existsSync(altPath)) {
        console.log(`✅ Path alternativ găsit: ${altPath}`);
        const files = fs.readdirSync(altPath);
        console.log(`📂 Fișiere în ${altPath}:`, files);
      } else {
        console.log(`❌ Path alternativ NU există: ${altPath}`);
      }
    } catch (e: any) {
      console.log(`❌ Eroare la path ${altPath}:`, e.message);
    }
  });
}

// 🔥 SERVIM FRONTEND-UL REACT CONSTRUIT!
app.use(express.static(clientBuildPath));

// 🔥 RUTA ROOT - SERVIM INDEX.HTML
app.get('/', (req, res) => {
  console.log('🌍 ROOT HIT - SERVING INDEX.HTML!');
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log('📄 Încercăm să servim:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    console.log('✅ INDEX.HTML SERVIT CU SUCCES!');
  } else {
    console.log('❌ INDEX.HTML NU EXISTĂ! Returnăm eroare.');
    res.status(404).json({ error: 'index.html not found', path: indexPath });
  }
});

// 🔥 HEALTHCHECK - RĂMÂNE PENTRU ADMIN/RAILWAY
app.get('/api/health', (req, res) => {
  console.log('🩺 HEALTHCHECK HIT!');
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: PORT,
    host: HOST,
    env: process.env.NODE_ENV,
    clientBuildExists: fs.existsSync(clientBuildPath)
  });
});

// 🔥 CATCH-ALL PENTRU SPA (REACT ROUTER)
// Orice rută care nu e API sau fișier static va returna index.html
app.get('*', (req, res) => {
  console.log(`🌍 CATCH-ALL HIT: ${req.url} - SERVING INDEX.HTML!`);
  const indexPath = path.join(clientBuildPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log('❌ INDEX.HTML NU EXISTĂ! Returnăm eroare.');
    res.status(404).json({ error: 'index.html not found', path: indexPath });
  }
});

console.log('🔥 ÎNAINTE DE app.listen()...');

app.listen(PORT, HOST, () => {
  console.log(`🚀🚀🚀 SERVER PORNIT CU SUCCES! 🚀🚀🚀`);
  console.log(`📍 PORT: ${PORT}`);
  console.log(`🌐 HOST: ${HOST}`);
  console.log(`💓 Healthcheck: http://${HOST}:${PORT}/api/health`);
  console.log(`🌐 Frontend: http://${HOST}:${PORT}/`);
  console.log(`✅ RAILWAY AR TREBUI SĂ VADĂ CĂ SERVERUL E GATA!`);
});

export default app;