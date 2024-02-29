// This function is designed to validate the paymentMethodId and amount fields in the request body.
const validatePayment = (req, res, next) => {
  // Extract paymentMethodId and amount from the request body.
  const { paymentMethodId, amount } = req.body;

  // Check if paymentMethodId or amount is missing or empty.
  if (paymentMethodId === undefined || paymentMethodId.trim() === '' || amount === undefined || amount === '') {
    return res.status(400).json({ message: "Missing required payment parameters." });
  }

  // Validate the amount to ensure it's a number and greater than 0.
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  // If both paymentMethodId and amount pass the validation checks,
  // call next() to pass control to the next middleware function in the stack.
  next();
};

export default validatePayment;
