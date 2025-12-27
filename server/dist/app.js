"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const Client_1 = require("./models/Client");
const Service_1 = require("./models/Service");
const Appointment_1 = require("./models/Appointment");
const Admin_1 = require("./models/Admin");
const auth_1 = __importDefault(require("./routes/auth"));
const services_1 = __importDefault(require("./routes/services"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const contact_1 = __importDefault(require("./routes/contact"));
const admin_1 = __importDefault(require("./routes/admin"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable CSP to avoid React issues
    crossOriginEmbedderPolicy: false
}));
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // Increased limit for debugging
});
app.use(limiter);
// CORS configuration - Allow all for debugging/production fix
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    credentials: true
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/services', services_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/gallery', gallery_1.default);
app.use('/api/newsletters', newsletter_1.default);
// Serve uploaded files
app.use('/uploads', express_1.default.static('uploads'));
// Serve static files from React app in production - FORCE SERVING ALWAYS
// Serve static files first, with correct path resolution
const clientBuildPath = path_1.default.join(__dirname, '../client-build');
console.log('Serving static files from:', clientBuildPath);
app.use(express_1.default.static(clientBuildPath, {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', 'htm'],
    index: ['index.html'],
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now().toString());
    }
}));
// Health check endpoint (moved up)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// 404 handler - catch-all must be the LAST middleware
// BUT it should NOT intercept the frontend in production
// Only use this 404 handler for API routes that weren't matched
// Use a regex-safe middleware instead of path string with wildcard
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ message: 'API Route not found' });
    }
    else {
        next();
    }
});
// Catch-all handler for React Router - SIMPLIFIED FOR DEMO
// This serves index.html for any route that doesn't match API or static files
app.use((req, res) => {
    console.log('Catch-all handler for:', req.path);
    res.sendFile(path_1.default.join(__dirname, '../client-build', 'index.html'), (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(404).json({ message: 'Frontend not found' });
        }
    });
});
// Database connection and server start
const startServer = async () => {
    try {
        try {
            await database_1.sequelize.authenticate();
            console.log('Database connection established successfully.');
            // Initialize all models - use sync() without alter to prevent infinite loops
            await Client_1.Client.sync();
            await Admin_1.Admin.sync();
            await Service_1.Service.sync();
            await Appointment_1.Appointment.sync();
            console.log('Database synchronized.');
            // Check if default admin exists, if not create one
            const adminCount = await Admin_1.Admin.count();
            if (adminCount === 0) {
                const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
                const defaultPassword = await bcrypt.hash('admin123', 10);
                await Admin_1.Admin.create({
                    email: 'admin@beautysalon.com',
                    password: defaultPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin',
                    isActive: true
                });
                console.log('Default admin user created (admin@beautysalon.com / admin123)');
            }
        }
        catch (dbError) {
            console.error('Database connection failed, but starting server anyway:', dbError);
            console.warn('The application is running in "Offline Mode" (No Database). API endpoints requiring DB will fail.');
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('Critical server error:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map