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

export { closeConnection, ItemModel }