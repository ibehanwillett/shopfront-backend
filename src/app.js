import express from 'express'
import cors from 'cors' 
import itemRoutes from './routes/item_routes.js'


const app = express()
// we need this import so that other ports can access the database
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'Shopfront Backend' }))

app.use('/items', itemRoutes)

export default app