import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import validatePayment from '../middlewares/validatePayment.js';
import { generateAccessToken, authenticateToken, authorize }  from '../controllers/auth.js';

const router = express.Router();

router.post('/process-payment', validatePayment, processPayment);

export default router;
