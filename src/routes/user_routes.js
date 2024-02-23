import { UserModel } from "../db.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../controllers/auth.js"

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
                res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
                res.status(200).send(token)
            } else {
                res.status(404).send("Invalid email or password")
            }
        } else {
            res.status(404).send("Invalid email or password")
        }
    } catch (err) {
        res.status(400).send({error: err.message})}
})

// Register New User

// Delele User



export default router 