import express from 'express'
import cors from 'cors' 
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import itemRoutes from './routes/item_routes.js'
import userRoutes from './routes/user_routes.js'
import paymentRoutes from './routes/paymentRoutes.js'

dotenv.config();


const app = express()
// we need this import so that other ports can access the database
app.use(cors({
    origin: 'http://localhost:5173', //change to domain of deployed website post deployment
    credentials: true,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ]
}))

app.use(express.json())

app.use(cookieParser())

app.get('/', (req, res) => res.send({ info: 'Shopfront Backend' }))

app.use('/items', itemRoutes)

app.use('/users', userRoutes)

app.use('/payment', paymentRoutes);

export default app