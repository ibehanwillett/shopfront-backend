import express from 'express';
import { processPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/process-payment', processPayment);

export default router;
