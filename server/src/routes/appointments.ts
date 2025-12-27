import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { Appointment } from '../models/Appointment';
import { Service } from '../models/Service';
import { Client } from '../models/Client';
import { Op } from 'sequelize';

const router = express.Router();

// Book an appointment
router.post('/book', authenticateToken, [
  body('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, appointmentDate, appointmentTime, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if service exists and is active
    const service = await Service.findOne({
      where: { id: serviceId, isActive: true },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
      return res.status(400).json({ message: 'Appointment must be in the future' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      clientId: userId,
      serviceId,
      appointmentDate,
      appointmentTime,
      notes: notes || '',
      totalPrice: service.price,
      status: 'pending',
    });

    // Fetch the created appointment with related data
    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Service, as: 'service' },
      ],
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: appointmentWithDetails,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error while booking appointment' });
  }
});

// Get user's appointments
router.get('/my-appointments', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const appointments = await Appointment.findAll({
      where: { clientId: userId },
      include: [
        { model: Service, as: 'service' },
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// Cancel appointment
router.put('/cancel/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOne({
      where: { id: appointmentId, clientId: userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }

    await appointment.update({ status: 'cancelled' });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error while cancelling appointment' });
  }
});

// Admin routes - Get all appointments
router.get('/admin/all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, search, date } = req.query;
    
    let whereClause: any = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { '$client.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$client.lastName$': { [Op.iLike]: `%${search}%` } },
        { '$client.email$': { [Op.iLike]: `%${search}%` } },
        { '$service.name$': { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (date) {
      whereClause.appointmentDate = date;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Client, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Service, as: 'service' },
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// Admin - Update appointment
router.put('/admin/:id', authenticateToken, [
  body('clientName').optional().notEmpty().trim(),
  body('clientEmail').optional().isEmail().normalizeEmail(),
  body('clientPhone').optional().notEmpty().trim(),
  body('serviceId').optional().isInt({ min: 1 }),
  body('appointmentDate').optional().isISO8601(),
  body('appointmentTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
  body('notes').optional().isLength({ max: 500 }),
  body('totalPrice').optional().isNumeric().isFloat({ min: 0 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data', errors: errors.array() });
    }

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Service, as: 'service' },
      ],
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const updateData = { ...req.body };
    
    // Convert numeric fields
    if (updateData.serviceId) updateData.serviceId = parseInt(updateData.serviceId);
    if (updateData.totalPrice) updateData.totalPrice = parseFloat(updateData.totalPrice);

    await appointment.update(updateData);
    
    // Reload to get updated data with associations
    const updatedAppointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Service, as: 'service' },
      ],
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

// Admin - Delete appointment
router.delete('/admin/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment' });
  }
});

export default router;