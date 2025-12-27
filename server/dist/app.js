"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
console.log('🔥🔥🔥 RAILWAY DEBUG: APP.TS PORNIT! 🔥🔥🔥');
console.log('📅 Data:', new Date().toISOString());
console.log('🎯 PORT din process.env:', process.env.PORT);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🌐 HOST din process.env:', process.env.HOST);
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';
console.log('🚀 PORT final:', PORT);
console.log('🌐 HOST final:', HOST);
console.log('🔥 RAILWAY PORT REAL:', process.env.PORT || 'Folosim 8080 default');
// 🔥 SERVIM FRONTEND-UL REACT CONSTRUIT!
const clientBuildPath = path_1.default.join(__dirname, '..', 'client-build');
console.log('📁 Client build path:', clientBuildPath);
app.use(express_1.default.static(clientBuildPath));
// 🔥 RUTA ROOT - SERVIM INDEX.HTML
app.get('/', (req, res) => {
    console.log('🌍 ROOT HIT - SERVING INDEX.HTML!');
    res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
});
// 🔥 HEALTHCHECK - RĂMÂNE PENTRU ADMIN/RAILWAY
app.get('/api/health', (req, res) => {
    console.log('🩺 HEALTHCHECK HIT!');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: PORT,
        host: HOST,
        env: process.env.NODE_ENV
    });
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