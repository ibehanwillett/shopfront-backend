import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import validatePayment from '../middlewares/validatePayment.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/process-payment', authenticate, validatePayment, processPayment);

export default router;
