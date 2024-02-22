import { UserModel } from "../db.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../auth.js"

const router = Router()

router.get('/', async (req, res) => res.send(await UserModel.find().select('username')))

router.post('/login', async (req, res) => {
    try {
        const dbUser = (await UserModel.findOne({username: req.body.username}))
        if (dbUser) {
            let submittedPass= req.body.password
            let storedPass = dbUser.password
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass)
            if (passwordMatch) {
                const token = generateAccessToken(dbUser.username)
                res.status(200).send(token) 
            } else {
                res.status(404).send("Invalid username or password")
            }
        } else {
            res.status(404).send("Invalid username or password")
        }
    } catch (err) {
        res.status(400).send({error: err.message})}
})



export default router 