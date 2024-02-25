import { UserModel } from "../db.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { generateAccessToken, authenticateToken, authorizeAdmin, authorize } from "../controllers/auth.js"
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

// Log out
router.get("/logout", authenticateToken, (req, res) => {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out" });
  })


// Register New User
router.post('/', async (req, res) => {
    try {
        user = await UserModel.findOne({email: req.body.email})
        if (user) {
            return res.status(400).json({error: 'Email has already been registered'})
        } else {
            const newUser = new UserModel({
                email: req.body.email,
                password: req.body.password
            })
            let saltRounds = 12
            hashedPassword = await bcrypt.hash(newUser.password, saltRounds)
            newUser.password = hashedPassword
            newUser.save()
            return res.status(200).json({message: newUser})
    }
} catch (err) {
    res.status(400).send({error: err.message})
}
    
})

// Delete User
router.delete('/:id', authorize, async (req, res) => {
    try {
        user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({error: 'No account registered with this email address'})
        } else {
            deleteUser= await UserModel.findByIdAndDelete(req.params.id)
            if (deleteUser) {
                res.sendStatus(204)
            } else {
                res.status(404).send({error: err.message})
            }
        }
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

// test route
router.get("/meow", authorizeAdmin, (req, res) => {
    res.status(200).json({success:"meow meow"})
})

// test route
router.get("/bark/:id", authorize, (req, res) => {
    res.status(200).json({success:"bark bark"})
})





export default router 