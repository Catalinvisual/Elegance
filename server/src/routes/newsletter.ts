import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import nodemailer from 'nodemailer';
import { Newsletter } from '../models/Newsletter';
import { Subscriber } from '../models/Subscriber';
import { Op } from 'sequelize';

const router = express.Router();



// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Get all newsletters
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const newsletters = await Newsletter.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(newsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new newsletter
router.post('/', 
  authenticateToken,
  [
    body('subject').trim().isLength({ min: 1, max: 200 }),
    body('content').trim().isLength({ min: 1 }),
    body('status').isIn(['draft', 'sent', 'scheduled'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      const { subject, content, status } = req.body;
      
      // Get active subscribers count
      const activeSubscribers = await Subscriber.count({ where: { isActive: true } });
      
      const newNewsletter = await Newsletter.create({
        subject,
        content,
        recipients: activeSubscribers,
        sentAt: null,
        status
      });

      res.status(201).json(newNewsletter);
    } catch (error) {
      console.error('Error creating newsletter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update newsletter
router.put('/:id', 
  authenticateToken,
  [
    body('subject').trim().isLength({ min: 1, max: 200 }),
    body('content').trim().isLength({ min: 1 }),
    body('status').isIn(['draft', 'sent', 'scheduled'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      const { id } = req.params;
      const { subject, content, status } = req.body;
      
      const newsletter = await Newsletter.findByPk(id);
      if (!newsletter) {
        return res.status(404).json({ message: 'Newsletter not found' });
      }

      // Get active subscribers count
      const activeSubscribers = await Subscriber.count({ where: { isActive: true } });

      await newsletter.update({
        subject,
        content,
        status,
        recipients: activeSubscribers
      });

      res.json(newsletter);
    } catch (error) {
      console.error('Error updating newsletter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Send newsletter
router.post('/:id/send', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findByPk(id);
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    if (newsletter.status === 'sent') {
      return res.status(400).json({ message: 'Newsletter already sent' });
    }

    const activeSubscribers = await Subscriber.findAll({ where: { isActive: true } });
    
    // Send emails to all subscribers
    let sentCount = 0;
    for (const subscriber of activeSubscribers) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: subscriber.email,
          subject: newsletter.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #db2777; margin: 0;">Elegance Studio</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                ${newsletter.content}
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
                <p style="color: #666; font-size: 14px; text-align: center;">
                  You're receiving this because you subscribed to our newsletter.
                  <br />
                  <a href="#" style="color: #db2777;">Unsubscribe</a> | 
                  <a href="#" style="color: #db2777;">Update preferences</a>
                </p>
              </div>
            </div>
          `
        });
        sentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
      }
    }

    // Update newsletter status
    await newsletter.update({
      status: 'sent',
      sentAt: new Date(),
      recipients: sentCount
    });

    res.json({ message: 'Newsletter sent successfully', recipients: sentCount });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete newsletter
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findByPk(id);
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    if (newsletter.status === 'sent') {
      return res.status(400).json({ message: 'Cannot delete sent newsletter' });
    }

    await newsletter.destroy();
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get newsletter statistics
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const totalSubscribers = await Subscriber.count();
    const activeSubscribers = await Subscriber.count({ where: { isActive: true } });
    const sentNewsletters = await Newsletter.count({ where: { status: 'sent' } });
    
    // Get current month newsletters
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonth = await Newsletter.count({
      where: {
        sentAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    const stats = {
      totalSubscribers,
      activeSubscribers,
      sentNewsletters,
      thisMonth
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subscribers
router.get('/subscribers', authenticateToken, async (req: Request, res: Response) => {
  try {
    const subscribers = await Subscriber.findAll({
      order: [['subscribedAt', 'DESC']]
    });
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;