import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import validatePayment from '../middlewares/validatePayment.js';

const router = express.Router();

// This route is designed to handle payment processing requests.
// The route uses two middlewares: validatePayment and processPayment.
// - validatePayment is executed first to ensure the request data is valid.
// - If validatePayment passes, processPayment is called to actually process the payment.
// If validatePayment finds any issues, it will respond to the client directly and prevent processPayment from running.
router.post('/process-payment', validatePayment, processPayment);

export default router;
