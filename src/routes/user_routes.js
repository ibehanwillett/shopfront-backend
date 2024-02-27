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

router.get("/autoLogin", (req, res) => {
    const cookie = req.headers.cookie;
  
    // if we received no cookies then user needs to login.
    if (!cookie || cookie === null) {
      return res.sendStatus(401);
    }
  
    return res.sendStatus(200)
})

// Log out
router.get("/logout", authenticateToken, async (req, res) => {
    return await res.clearCookie("access_token").status(200).json({message: "Successfully logged out!"});
  })


// Register New User
router.post('/', async (req, res) => {
    try {
        let user = await UserModel.findOne({email: req.body.email})
        if (user) {
            return res.status(400).json({error: 'Email has already been registered'})
        } else {
            let newUser = new UserModel({
                email: req.body.email,
                first: req.body.first,
                last: req.body.last,
                password: req.body.password
            })
            let saltRounds = 12
            let hashedPassword = await bcrypt.hash(newUser.password, saltRounds)
            newUser.password = hashedPassword
            newUser.save()
            const token = generateAccessToken(newUser.email)
            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    secure: process.env.NODE_ENV === "production",
                  })
                  .status(201).send(newUser)
    }
} catch (err) {
    res.status(400).send({error: err.message})
}
    
})

// Update user 
router.patch('/:id', authorize, async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(res.locals.activeUser._id, req.body, {new: true})
        if (req.body.password) {
            let saltRounds = 12
            let hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
            updatedUser.password = hashedPassword
        }
            updatedUser.save()
            return res.status(201).json(updatedUser)
    } catch (err) {
    res.status(400).send({error: err.message})
}
})

// Delete User
router.delete('/:id', authorize, async (req, res) => {
    try {
        let user = res.locals.activeUser
        if (!user) {
            return res.status(400).json({error: 'No account registered with this email address'})
        } else {
            await UserModel.findByIdAndDelete(req.params.id)
            res.sendStatus(204)
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