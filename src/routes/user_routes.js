import { UserModel } from "../db.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { generateAccessToken, authenticateToken, authorize } from "../controllers/auth.js"
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

router.get('/', async (req, res) => res.send(await UserModel.find().select('email')))

router.post('/login', async (req, res) => {
    try {
        const dbUser = (await UserModel.findOne({email: req.body.email}))
        if (dbUser) {
            let submittedPass= req.body.password
            let storedPass = dbUser.password
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass)
            if (passwordMatch) {
                const token = generateAccessToken(dbUser.email)
                res
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                  })
                  .status(200)
                  .json({ message: "Logged in successfully" })
            }
        } else {
            res.status(404).send("Invalid email or password")
        }
    } catch (err) {
        res.status(400).send({error: err.message})}
})


router.get("/meow", authorize, (req, res) => {
    res.status(200).json({success:"meow meow"})
})

// Register New User

// Delele User



export default router 