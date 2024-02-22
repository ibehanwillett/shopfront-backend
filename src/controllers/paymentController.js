import { createPaymentIntent } from '../services/stripeService.js';

export const processPayment = async (req, res) => {
    const { paymentMethodId, amount } = req.body;
  
    if (!paymentMethodId || !amount) {
      return res.status(400).json({ success: false, message: "Missing required parameters." });
    }
  
    try {
      const paymentIntent = await createPaymentIntent(paymentMethodId, amount);
      res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
