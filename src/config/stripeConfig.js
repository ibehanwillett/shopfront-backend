import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
// Initialize the Stripe object with the Stripe secret key.
// The Stripe secret key is read from the environment variables, which were loaded into process.env by dotenv.
// This key is used to authenticate the server's requests to the Stripe API.
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
