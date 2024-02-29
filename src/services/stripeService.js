import stripe from "../config/stripeConfig.js";

// Define an asynchronous function named createPaymentIntent.
export const createPaymentIntent = async (paymentMethodId, amount) => {
  // Call the create method on the paymentIntents object of the Stripe library.
  return stripe.paymentIntents.create({
    // The amount to be charged. This value is provided in the smallest currency unit.
    amount: amount,

    // The currency in which the charge should be made.
    currency: "aud",

    // The ID of the payment method that will be charged. This ID is obtained through the
    // Stripe.js library on the client side and passed to the server where it can be used
    // to create a payment intent.
    payment_method: paymentMethodId,

    // When confirm: true is set, Stripe will attempt to confirm the payment intent immediately after it is created.
    confirm: true,

    // The automatic_payment_methods object is used to enable or disable automatic payment methods.
    // When enabled: true, Stripe automatically presents a payment method to the customer
    // based on their location and other factors. The allow_redirects: "never" option specifies
    // that the payment process should not redirect the customer to another page for authentication
    // or confirmation, aiming for a seamless payment experience within the current application flow.
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });
};
