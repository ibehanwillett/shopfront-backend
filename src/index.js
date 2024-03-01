import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

// Specifics the port that express should listen on. If no port is specified in the .env file port 4001 is used.
app.listen(process.env.PORT || 4001)