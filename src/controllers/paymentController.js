import { createPaymentIntent } from '../services/stripeService.js';

// Define an asynchronous function to process payment requests.
export const processPayment = async (req, res) => {
  // Destructure the paymentMethodId and amount from the request body.
    const { paymentMethodId, amount } = req.body; 
  
    // Basic validation for the request body
    if (!paymentMethodId || amount <= 0) {
        // Respond with a 400 Bad Request if the paymentMethodId is missing or the amount is invalid
        return res.status(400).json({
            success: false,
            message: 'Invalid request: Payment method and a positive amount are required.'
        });
    }

    try {
      // Attempt to create a payment intent by calling the createPaymentIntent function with the provided payment method ID and amount.
      // This involves communication with the Stripe API to securely handle the payment process.
      const paymentIntent = await createPaymentIntent(paymentMethodId, amount);
      // If successful, respond with a 200 OK status code, indicating success, and include the paymentIntent object in the response.
      res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
      // Log the error to the console for debugging purposes.
      console.error(error);

        // Handle known error types from Stripe
        if (error.type === 'StripeCardError') {
            res.status(402).json({ success: false, message: 'Your card was declined.' });
        } else if (error.type === 'RateLimitError') {
            res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
        } else if (error.type === 'StripeInvalidRequestError') {
            res.status(400).json({ success: false, message: 'Invalid request to payment processor.' });
        } else if (error.type === 'StripeAPIError') {
            res.status(500).json({ success: false, message: 'Internal payment processor error.' });
        } else if (error.type === 'StripeConnectionError') {
            res.status(502).json({ success: false, message: 'Network communication error with payment processor.' });
        } else if (error.type === 'StripeAuthenticationError') {
            res.status(403).json({ success: false, message: 'Authentication with payment processor failed.' });
        } else {
            res.status(500).json({
                success: false,
                message: 'An unexpected error occurred processing your payment. Please try again.'
            });
        }
    }
};