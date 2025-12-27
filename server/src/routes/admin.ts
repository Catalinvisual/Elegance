import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Service } from '../models/Service';
import { Appointment } from '../models/Appointment';
import { Newsletter } from '../models/Newsletter';
import { Gallery } from '../models/Gallery';

const router = express.Router();

// Admin login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const { email, password } = req.body;

    // Find admin in database
    const admin = await Admin.findOne({ 
      where: { email, isActive: true } 
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      email: admin.email,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findByPk(req.user!.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin registration (for initial setup)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').optional().isLength({ min: 2, max: 50 }),
  body('lastName').optional().isLength({ min: 2, max: 50 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      firstName: firstName || 'Admin',
      lastName: lastName || 'User',
      role: 'admin',
      isActive: true
    });

    const token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats endpoint
router.get('/dashboard/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const totalServices = await Service.count();
    const activeAppointments = await Appointment.count({
      where: { status: 'confirmed' }
    });
    const galleryImages = await Gallery.count();
    const newsletterSubscribers = await Newsletter.count({
      where: { status: 'sent' }
    });

    res.json({
      totalServices,
      activeAppointments,
      galleryImages,
      newsletterSubscribers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;