import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


dotenv.config()

//  Creating a JWT
export function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {}) // currently doesn't expire
  }