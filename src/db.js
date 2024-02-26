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
    category: { type: String, required: true, default: "Other" },
    name: { type: String, required: true, default: "Item Name" },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: "Item Description" },
    size: {type: String, required: true, default: "n/a"},
    image: { type: String, required: false },
    featured: { type: Boolean, required: true, default: false }
})

const ItemModel = mongoose.model("Item", itemSchema)

// Establishing user schema 

const userSchema = new mongoose.Schema({
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    first: {type: String, lowercase: true,  required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    last: {type: String, lowercase: true,  required: [true, "can't be blank"], match: [/^[A-Za-z\-]+(?: [A-Za-z\-]+)?$/, 'is invalid'], index: true},
    password: { type: String, required: true },
    admin: {type: Boolean, required: true, default: false}
})

const UserModel = mongoose.model("User", userSchema)

export { closeConnection, ItemModel, UserModel }