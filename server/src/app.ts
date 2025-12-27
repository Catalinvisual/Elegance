import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Service } from './models/Service';
import { Appointment } from './models/Appointment';
import { Admin } from './models/Admin';
import { Newsletter } from './models/Newsletter';
import { Gallery } from './models/Gallery';
import { Subscriber } from './models/Subscriber';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import galleryRoutes from './routes/gallery';
import newsletterRoutes from './routes/newsletter';

dotenv.config();

// LOGGING MASIV PENTRU RAILWAY DEBUGGING
console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log('🔥🔥🔥 APP.TS PORNIT - RAILWAY DEBUGGING 🔥🔥🔥');
console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log('📅 Data pornire:', new Date().toISOString());
console.log('📂 __dirname:', __dirname);
console.log('📂 process.cwd():', process.cwd());
console.log('🔧 TOATE variabilele de mediu:', Object.keys(process.env).sort());
console.log('🎯 PORT din process.env:', process.env.PORT);
console.log('🎯 NODE_ENV din process.env:', process.env.NODE_ENV);
console.log('🎯 RAILWAY variables:', {
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
  RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
  RAILWAY_DEPLOYMENT_ID: process.env.RAILWAY_DEPLOYMENT_ID
});

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log('🔥🔥🔥 APP.TS ÎNCEPE EXECUȚIA! 🔥🔥🔥');
console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log('=== SERVER STARTUP DEBUG ===');
console.log('PORT environment:', process.env.PORT);
console.log('PORT parsed:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);  

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to avoid React issues
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // Increased limit for debugging
});
app.use(limiter);

// CORS configuration - Allow all for debugging/production fix    
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));   

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🩺 HEALTHCHECK REQUEST PRIMIT:', new Date().toISOString());
  console.log('🩺 Request headers:', req.headers);
  console.log('🩺 Request IP:', req.ip);
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    host: '0.0.0.0',
    railway_vars: {
      env: process.env.RAILWAY_ENVIRONMENT,
      project: process.env.RAILWAY_PROJECT_ID,
      service: process.env.RAILWAY_SERVICE_ID
    }
  });
});

// Endpoint de debug suplimentar
app.get('/api/debug', (req, res) => {
  console.log('🔍 DEBUG REQUEST:', new Date().toISOString());
  
  res.json({
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    host: '0.0.0.0',
    env: process.env.NODE_ENV,
    railway_port: process.env.PORT,
    cwd: process.cwd(),
    __dirname: __dirname,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env_vars: Object.keys(process.env).sort()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/newsletters', newsletterRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve static files from React app - CORECTAT PENTRU STRUCTURA DOCKER
const clientBuildPath = path.join(__dirname, '../../client-build');
console.log('Serving static files from:', clientBuildPath);       
console.log('__dirname:', __dirname);

// Check if client build directory exists
const fs = require('fs');
if (fs.existsSync(clientBuildPath)) {
  console.log('Client build directory exists');
  const files = fs.readdirSync(clientBuildPath);
  console.log('Files in client-build:', files);
} else {
  console.error('Client build directory does NOT exist at:', clientBuildPath);
}

app.use(express.static(clientBuildPath, {
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



// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  } else {
    next();
  }
});

// Catch-all handler for React Router - CORECTAT PENTRU STRUCTURA DOCKER
// This serves index.html for any route that doesn't match API or static files
app.use((req, res) => {
  console.log('Catch-all handler for:', req.path);
  const indexPath = path.join(__dirname, '../../client-build', 'index.html');
  console.log('Sending index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(404).json({ message: 'Frontend not found', error: err.message });
    }
  });
});

// Database connection and server start
console.log('🔥🔥🔥 PORNIRE STARTSERVER() - ÎNAINTE DE TOT 🔥🔥🔥');
console.log('🔥 PORT:', PORT);
console.log('🔥 HOST: 0.0.0.0');
console.log('🔥 Vom apela app.listen() imediat...');

const startServer = async () => {
  try {
    console.log('🚀 Starting server initialization...');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV}`);       
    console.log(`💾 Database URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);

    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');

      // Initialize all models - use sync() without alter to prevent infinite loops
      await Client.sync();
      await Admin.sync();
      await Service.sync();
      await Appointment.sync();
      await Newsletter.sync();
      await Gallery.sync();
      await Subscriber.sync();

      console.log('Database synchronized.');

      // Check if default admin exists, if not create one
      const adminCount = await Admin.count();
      if (adminCount === 0) {
        const bcrypt = await import('bcryptjs');
        const defaultPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
          email: 'admin@beautysalon.com',
          password: defaultPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true
        });
        console.log('Default admin user created (admin@beautysalon.com / admin123)');
      }
    } catch (dbError) {
      console.error('Database connection failed, but starting server anyway:', dbError);
      console.warn('The application is running in "Offline Mode" (No Database). API endpoints requiring DB will fail.');
    }

    console.log(`🚀 PORNIRE SERVER - ÎNAINTE DE app.listen()`);
    console.log(`📍 Port: ${PORT}, Host: 0.0.0.0`);
    console.log(`🎯 TIP: app.listen() VA FI APELAT ACUM!`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
      console.log(`🎉 SERVER PORNIT CU SUCCES!`);
      console.log(`🎉 Server is running on port ${PORT}`);        
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);     
      console.log(`📍 Listening on: http://0.0.0.0:${PORT}`);     
      console.log(`💓 Health check available at: http://0.0.0.0:${PORT}/api/health`);
      console.log(`🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
      
      // Heartbeat pentru debugging
      setInterval(() => {
        console.log(`💓 SERVER ALIVE - Port: ${PORT} - Time: ${new Date().toISOString()}`);
      }, 10000);
    });
    
    process.on('uncaughtException', (error) => {
      console.error('🚨 UNCAUGHT EXCEPTION:', error);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 UNHANDLED REJECTION:', reason, 'Promise:', promise);
    });
  } catch (error) {
    console.error('Critical server error:', error);
    process.exit(1);
  }
};

startServer();

export default app;