import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UserModel } from '../db'


dotenv.config()

//  Creating a JWT
export function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {}) // currently doesn't expire
  }

// Authenticating a JWT
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findOne({email: decoded.email, 'tokens.token': token})

    if (!user) {
        throw new Error()
    }

    req.token = token
    req.user = user
    next()

} catch (error) {
    res.status(401).send({error: 'Please authenticate.'})
}
}