// Importing necessary libraries and modules
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UserModel } from '../db.js'

// Load environment variables from .env file into process.env
dotenv.config()

// Creates JWT token
export function generateAccessToken(email) {
    // Sign the JWT with the user's email and the secret from .env. This token does not expire.
    return jwt.sign(email, process.env.TOKEN_SECRET, {})
}

export const authenticateToken = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.access_token) {
      // Check if the access_token cookie is missing
      throw new Error('Access token is missing.');
    }
    // Extract the token from cookies
    const token = req.cookies.access_token
    // Decode the token using the secret
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    // Find the user in the database by their email
    const user = await UserModel.findOne({email: decoded})
    if (!user) {
        // If no user matches the email from the token, throw an error to be caught by the catch block
        throw new Error("User not found.")
    }
    // Attach the token and user to the request for further processing
    req.token = token
    res.locals.activeUser = user
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      // Handle invalid token errors specifically
      res.status(400).send({error: 'Invalid token.'})
    } else {
      // Send a 401 response for all other authentication failures
      res.status(401).send({error: 'Please authenticate.'})
    }
  }
};

// Authenticating a JWT with route parameters
export const authorize = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.access_token) {
      throw new Error('Access token is missing.');
    }
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    const user = await UserModel.findOne({email: decoded})
    const dbUser = await UserModel.findOne({_id: req.params.id})
    
    if (!user || (!user.admin && JSON.stringify(user) !== JSON.stringify(dbUser))) {
        throw new Error("Invalid user.")
    }
    
    req.token = token
    res.locals.activeUser = dbUser
    next()
  } catch (error) {
    res.status(401).send({error: 'Authorization error.'})
  }
};

// Authorize Admin
export const authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.access_token) {
      throw new Error('Access token is missing.');
    }
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    const user = await UserModel.findOne({email: decoded})

    if (!user || !user.admin) {
        throw new Error("Access denied. Admin privileges required.")
    }

    req.token = token
    next()
  } catch (error) {
    // Enhance error handling by differentiating the error response based on the error type
    switch(error.name) {
      case 'JsonWebTokenError':
        res.status(400).send({error: 'Invalid token.'})
        break
      default:
        res.status(401).send({error: 'Authorization error.'})
    }
  }
};
