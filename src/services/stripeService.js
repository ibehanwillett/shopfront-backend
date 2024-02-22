import stripe from '../config/stripeConfig.js';

export const createPaymentIntent = async (paymentMethodId, amount) => {
  return stripe.paymentIntents.create({
    amount: amount,
    currency: 'aud',
    payment_method: paymentMethodId,
    confirm: true,
  });
};
