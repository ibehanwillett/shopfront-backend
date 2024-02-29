import { UserModel } from "../db.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { generateAccessToken, authenticateToken, authorizeAdmin, authorize } from "../controllers/auth.js"
import dotenv from 'dotenv'

dotenv.config() // Initialize dotenv to load the environment variables.

const router = Router() // Create a new instance of Router for defining routes.

// GET route to list all users' emails. This could be used for admin purposes to see a list of registered users.
router.get('/', async (req, res) => res.send(await UserModel.find().select('email')))

// POST route for user login. Validates the user's email and password against the database.
router.post('/login', async (req, res) => {
    try {
        const dbUser = (await UserModel.findOne({email: req.body.email})) // Attempt to find the user by email.
        if (dbUser) {
            // Retrieve the submitted password from the request body
            let submittedPass = req.body.password
            // Retrieve the stored (hashed) password for the user from the database
            let storedPass = dbUser.password
            // Use bcrypt to compare the submitted password with the stored hashed password
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass)
            
            // If the passwords match (i.e., the submitted password is correct)
            if (passwordMatch) {
                // Generate an access token for the user using their email
                const token = generateAccessToken(dbUser.email)
                res
                // Set the generated token as an HTTP-only cookie in the response
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'none'
                  })
                  .status(200)
                  .send(dbUser)
            }
        } else {
            // If the user is not found, return a 404 error.
            res.status(404).send("Invalid email or password")
        }
    } catch (err) {
        // Catch any errors and return a 400 status.
        res.status(400).send({error: err.message})}
})

// GET route for auto-login, using the authenticateToken middleware to verify the user's session.
router.get("/autoLogin", authenticateToken, (req, res) => {
    // If the token is valid, send back the active user's data.
    return res.status(200).send(res.locals.activeUser)
})

// Log out
router.get("/logout", authenticateToken, async (req, res) => {
     // Clear the cookie and return a successful logout message.
    return await res.clearCookie("access_token", 
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none'
      }).status(200).json({message: "Successfully logged out!"});
  })


// Register New User
router.post('/', async (req, res) => {
    try {
        // Check if the email is already registered.
        let user = await UserModel.findOne({email: req.body.email})
        if (user) {
            // If the user exists, return a 400 error.
            return res.status(400).json({error: 'Email has already been registered'})
        } else {
            // If the email has not been registered, create a new user instance with the provided details.
            let newUser = new UserModel({
                email: req.body.email, 
                first: req.body.first, 
                last: req.body.last, 
                password: req.body.password 
            })
            
            // Define the number of salt rounds to use for hashing the password.
            let saltRounds = 12
            
            // Hash the user's password using bcrypt.
            let hashedPassword = await bcrypt.hash(newUser.password, saltRounds)
            
            // Update the newUser instance with the hashed password.
            newUser.password = hashedPassword
            
            // Save the newUser instance to the database.
            await newUser.save()
            
            // Generate an access token for the new user using their email.
            const token = generateAccessToken(newUser.email)
            
            // Set the generated token in a cookie in the response.
            // Set the cookie to expire in 24 hours.
            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'none'
                })
                .status(201) // Respond with a 201 Created status code.
                .send(newUser) // Send the newly created user object as the response.
        }
    } catch (err) {
        // If an error occurs during the process, catch it and return a 400 Bad Request response with the error message.
        res.status(400).send({error: err.message})
    }
})

// Update user 
router.patch('/:id', authorize, async (req, res) => {
    try {
        // Attempt to find and update the user document in the database with the provided ID.
        const updatedUser = await UserModel.findByIdAndUpdate(res.locals.activeUser._id, req.body, {new: true})
        // Check if the request body includes a 'password' field, indicating the user wants to change their password.
        if (req.body.password) {
            // Define the number of salt rounds for hashing the new password.
            let saltRounds = 12
            
            // Hash the new password using bcrypt.
            let hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
            
            // Set the hashed password on the updatedUser document.
            updatedUser.password = hashedPassword
        }
            // Save the changes to the user document in the database.
            updatedUser.save()
             // Respond with a 201 Created status code and the updated user information.
            return res.status(201).json(updatedUser)
    } catch (err) {
          // If an error occurs during the process, catch it and send a 400 Bad Request response with the error message.
    res.status(400).send({error: err.message})
}
})

// Delete User
router.delete('/:id', authorize, async (req, res) => {
    try {
         // Obtain the user object from 'res.locals', which was set by the 'authorize' middleware.
        let user = res.locals.activeUser
        // Check if the user object is present. If not, it means there's no active session or user identified.
        if (!user) {
            // Respond with a 400 Bad Request status code and an error message if no user account is associated with the session.
            return res.status(400).json({error: 'No account registered with this email address'})
        } else {
            // If the user exists, proceed to delete the user account from the database by the provided ID.
            await UserModel.findByIdAndDelete(req.params.id)
            // After successfully deleting the user account, clear the session cookie ('access_token') to log out the user.
            res.clearCookie("access_token",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none'
              }).sendStatus(204) // 204 No Content status code indicates successful deletion with no content in the response body.
        }
    } catch (err) {
         // If an error occurs during the process, catch it and send a 400 Bad Request response with the error message.
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