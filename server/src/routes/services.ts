import express from 'express';
import { Service } from '../models/Service';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']],
    });

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      const category = service.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, typeof services>);

    res.json({
      services: groupedServices,
      categories: Object.keys(groupedServices),
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({
      where: { id: req.params.id, isActive: true },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error while fetching service' });
  }
});

// Admin routes - Get all services (including inactive)
router.get('/admin/all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']],
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
});

// Admin - Create new service
router.post('/admin', authenticateToken, upload.single('image'), [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('category').notEmpty().trim(),
  body('duration').isNumeric().isInt({ min: 15 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data', errors: errors.array() });
    }

    const { name, description, price, category, duration, discountPercentage = 0 } = req.body;
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : null;

    const service = await Service.create({
      name,
      description,
      price: parseFloat(price),
      category,
      duration: parseInt(duration),
      imageUrl,
      discountPercentage: parseFloat(discountPercentage) || 0,
      isActive: true,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error while creating service' });
  }
});

// Admin - Update service
router.put('/admin/:id', authenticateToken, upload.single('image'), [
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().notEmpty().trim(),
  body('duration').optional().isNumeric().isInt({ min: 15 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data', errors: errors.array() });
    }

    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updateData = { ...req.body };
    
    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.duration) updateData.duration = parseInt(updateData.duration);
    if (updateData.discountPercentage) updateData.discountPercentage = parseFloat(updateData.discountPercentage);
    
    // Handle image upload
    if (req.file) {
      updateData.imageUrl = `/uploads/services/${req.file.filename}`;
    }

    await service.update(updateData);
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error while updating service' });
  }
});

// Admin - Delete service
router.delete('/admin/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
});

// Admin - Toggle service status
router.patch('/admin/:id/toggle', authenticateToken, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.update({ isActive: !service.isActive });
    res.json(service);
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ message: 'Server error while toggling service status' });
  }
});

export default router;