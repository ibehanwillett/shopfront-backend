import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Config the .env file for use
dotenv.config()
 // Establishes a connection to the database
try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? 'DB connected!' : 'DB failed to connect')
}
catch (err) {
    console.error(err)
}

// Closes the connection to the database
const closeConnection = () => {
    console.log('Mongoose disconnecting ...')
    mongoose.disconnect()
}



// Establishes item schema

const itemSchema = new mongoose.Schema({
    category: { type: String, required: true, default: "Other" },
    name: { type: String, required: true, default: "Item Name" },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: "Item Description" },
    size: {type: String, required: true, default: "n/a"},
    image: { type: String, required: false },
    featured: { type: Boolean, required: true, default: false }
})
// Uses that schema to create a model for mongoose. This is how documents will be added to the MongoDB.
const ItemModel = mongoose.model("Item", itemSchema)

// Establishing user schema 

const userSchema = new mongoose.Schema({
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    first: {type: String, lowercase: true,  required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    last: {type: String, lowercase: true,  required: [true, "can't be blank"], match: [/^[A-Za-z\-]+(?: [A-Za-z\-]+)?$/, 'is invalid'], index: true},
    password: { type: String, required: true },
    admin: {type: Boolean, required: true, default: false}
})
// Uses that schema to create a user model for MongoDB
const UserModel = mongoose.model("User", userSchema)

export { closeConnection, ItemModel, UserModel }