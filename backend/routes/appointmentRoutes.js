import express from 'express';
import { getAppointments, createAppointment } from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAppointments);
router.post('/', verifyToken, createAppointment);

export default router;
