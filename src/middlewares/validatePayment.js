const validatePayment = (req, res, next) => {
    const { paymentMethodId, amount } = req.body;
  
    if (paymentMethodId === undefined || paymentMethodId === '' || amount === undefined || amount === '') {
      return res.status(400).json({ message: "Missing required payment parameters." });
    }
  
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }
  
    next();
};
  
  export default validatePayment;
  