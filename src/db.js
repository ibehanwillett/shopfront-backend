import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? 'DB connected!' : 'DB failed to connect')
}
catch (err) {
    console.error(err)
}

const closeConnection = () => {
    console.log('Mongoose disconnecting ...')
    mongoose.disconnect()
}



// Establishing item schema

const itemSchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    size: {type: String, required: false },
    image: { type: String, required: false },
    featured: { type: Boolean, required: false }
})

const ItemModel = mongoose.model("Item", itemSchema)

// Establishing user schema 

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    password: { type: String, required: true },
    email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    admin: {type: Boolean, required: true, default: false}
})

const UserModel = mongoose.model("User", userSchema)

export { closeConnection, ItemModel, UserModel }