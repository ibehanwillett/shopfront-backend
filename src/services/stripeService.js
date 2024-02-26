import stripe from "../config/stripeConfig.js";

export const createPaymentIntent = async (paymentMethodId, amount) => {
  return stripe.paymentIntents.create({
    amount: amount,
    currency: "aud",
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });
};
