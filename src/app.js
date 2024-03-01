import express from 'express'
import cors from 'cors' 
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import itemRoutes from './routes/item_routes.js'
import userRoutes from './routes/user_routes.js'
import paymentRoutes from './routes/paymentRoutes.js'

dotenv.config();

// Creates an express application
const app = express()

/* Defines the cross-orgin resource sharing. This permits browser requests orginating from 'https://nicolenightmare.xyz'
to load reasources. Credentials are allowed, permitting access to cookies. */ 

app.use(cors({
    origin: 'https://nicolenightmare.xyz', 
    credentials: true,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ]
}))

// Parses incoming requests with JSON payloads
app.use(express.json())

// Parses the cookie header & populates req.cookie with the on object keyed with "access_token" (the cookie's name) 
app.use(cookieParser())

// Intialize an endpoint, a GET request sent to '/' will return an object with the value 'Shopfront Backend' with the key of info
app.get('/', (req, res) => res.send({ info: 'Shopfront Backend' }))

// Implements all routes in the item_routes module with the prefix of '/items'
app.use('/items', itemRoutes)

// Implements all routes in the user_routes module with the prefix of '/users'
app.use('/users', userRoutes)

// Implements all routes in the paymentRoutes module with the prefix of '/payment'
app.use('/payment', paymentRoutes);

export default app