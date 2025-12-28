"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
console.log('🔥🔥🔥 RAILWAY DEBUG: APP.TS PORNIT! 🔥🔥🔥');
console.log('📅 Data:', new Date().toISOString());
console.log('🎯 PORT din process.env:', process.env.PORT);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🌐 HOST din process.env:', process.env.HOST);
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '8080', 10);
// FORCE 0.0.0.0 to ensure external access in Docker/Railway
const HOST = '0.0.0.0';
console.log('🚀 PORT final:', PORT);
console.log('🌐 HOST final:', HOST);
console.log('🔥 RAILWAY PORT REAL:', process.env.PORT || 'Folosim 8080 default');
// 🔥 VERIFICĂM DACĂ CLIENT-BUILD EXISTĂ
const clientBuildPath = path_1.default.join(__dirname, '..', 'client-build');
console.log('📁 Client build path absolut:', clientBuildPath);
try {
    const files = fs_1.default.readdirSync(clientBuildPath);
    console.log('📂 Fișiere găsite în client-build:', files);
    const indexPath = path_1.default.join(clientBuildPath, 'index.html');
    if (fs_1.default.existsSync(indexPath)) {
        console.log('✅ index.html există!');
        const indexContent = fs_1.default.readFileSync(indexPath, 'utf8');
        console.log('📄 Primele 200 caractere din index.html:', indexContent.substring(0, 200));
    }
    else {
        console.log('❌ index.html NU există!');
    }
}
catch (error) {
    console.log('❌ EROARE la citirea client-build:', error.message);
    console.log('🔍 Verificăm directorul curent:', __dirname);
    // Încercăm și alte path-uri posibile
    const altPaths = [
        path_1.default.join(__dirname, 'client-build'),
        path_1.default.join(process.cwd(), 'client-build'),
        '/app/server/client-build',
        path_1.default.join(__dirname, '..', 'client-build')
    ];
    altPaths.forEach(altPath => {
        try {
            if (fs_1.default.existsSync(altPath)) {
                console.log(`✅ Path alternativ găsit: ${altPath}`);
                const files = fs_1.default.readdirSync(altPath);
                console.log(`📂 Fișiere în ${altPath}:`, files);
            }
            else {
                console.log(`❌ Path alternativ NU există: ${altPath}`);
            }
        }
        catch (e) {
            console.log(`❌ Eroare la path ${altPath}:`, e.message);
        }
    });
}
// 🔥 SERVIM FRONTEND-UL REACT CONSTRUIT!
app.use(express_1.default.static(clientBuildPath));
// 🔥 RUTA ROOT - SERVIM INDEX.HTML
app.get('/', (req, res) => {
    console.log('🌍 ROOT HIT - SERVING INDEX.HTML!');
    const indexPath = path_1.default.join(clientBuildPath, 'index.html');
    console.log('📄 Încercăm să servim:', indexPath);
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
        console.log('✅ INDEX.HTML SERVIT CU SUCCES!');
    }
    else {
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
        clientBuildExists: fs_1.default.existsSync(clientBuildPath)
    });
});
// 🔥 CATCH-ALL PENTRU SPA (REACT ROUTER)
// Orice rută care nu e API sau fișier static va returna index.html
// Express 5: wildcard-ul trebuie să aibă un nume de parametru
app.get('*path', (req, res) => {
    console.log(`🌍 CATCH-ALL HIT: ${req.url} - SERVING INDEX.HTML!`);
    const indexPath = path_1.default.join(clientBuildPath, 'index.html');
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
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
exports.default = app;
//# sourceMappingURL=app.js.map