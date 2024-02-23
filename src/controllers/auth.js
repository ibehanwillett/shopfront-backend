import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UserModel } from '../db.js'


dotenv.config()

//  Creating a JWT
export function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, {}) // currently doesn't expire
  }

// Authenticating a JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token
    console.log(token)
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    console.log(decoded)
    const user = await UserModel.findOne({email: decoded})

    if (!user) {
        throw new Error()
    }

    req.token = token
    next()

} catch (error) {
    res.status(401).send({error: 'Please authenticate.'})
}
}