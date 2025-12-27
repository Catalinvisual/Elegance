import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { Gallery } from '../models/Gallery';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new gallery image
router.post('/', 
  authenticateToken,
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 1, max: 100 }),
    body('description').trim().isLength({ max: 500 }),
    body('category').isIn(['services', 'interior', 'products', 'team', 'results']),
    body('isActive').isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
      }

      const { title, description, category, isActive } = req.body;
      
      const newImage = await Gallery.create({
        url: `/uploads/gallery/${req.file.filename}`,
        title,
        description,
        category,
        isActive: isActive === 'true',
      });

      res.status(201).json(newImage);
    } catch (error) {
      console.error('Error adding gallery image:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update gallery image
router.put('/:id', 
  authenticateToken,
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 1, max: 100 }),
    body('description').trim().isLength({ max: 500 }),
    body('category').isIn(['services', 'interior', 'products', 'team', 'results']),
    body('isActive').isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      const { id } = req.params;
      const { title, description, category, isActive } = req.body;
      
      const image = await Gallery.findByPk(id);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const updateData: any = {
        title,
        description,
        category,
        isActive: isActive === 'true',
      };

      // Handle image upload
      if (req.file) {
        updateData.url = `/uploads/gallery/${req.file.filename}`;
      }

      await image.update(updateData);
      res.json(image);
    } catch (error) {
      console.error('Error updating gallery image:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Toggle image status
router.patch('/:id/status', 
  authenticateToken,
  body('isActive').isBoolean(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      const { id } = req.params;
      const { isActive } = req.body;

      const image = await Gallery.findByPk(id);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      await image.update({ isActive });
      res.json({ 
        id: parseInt(id), 
        isActive,
        message: 'Image status updated successfully' 
      });
    } catch (error) {
      console.error('Error updating image status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete gallery image
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;