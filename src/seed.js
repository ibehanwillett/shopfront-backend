import { ItemModel, closeConnection } from "./db.js"


const items = [
    { 
        category: "Tees", 
        name: "Fab Shirt",
        price: 38.00, 
        description: "Fab Shirt",
        size: "M",
        image: 'no-image.png',
        featured: true,
    },
    { 
        category: "Hats", 
        name: "Cool Hat",
        price: 29.00, 
        description: "Cool Hat",
        size: "OS",
        image: "Cool Hat",
        featured: false,
    },
    { 
        category: "Art", 
        name: "Unique Painting",
        price: 133.00, 
        description: "Unique Painting",
        size: "n/a",
        image: "Unique Painting",
        featured: false,
    },
    { 
        category: "Accessories", 
        name: "Cool Keyring",
        price: 12.00, 
        description: "Cool Keyring",
        size: "S",
        image: "Cool Keyring",
        featured: true,
    },
    { 
        category: "Tees", 
        name: "Sparkly Shirt",
        price: 38.00, 
        description: "Sparkly tee for sparkly times.",
        size: "XS",
        image: "Fab Shirt",
        featured: false,
    },
    { 
        category: "Hats", 
        name: "Logo Hat",
        price: 29.00, 
        description: "Nicole Nightmare signature art on this sweet hat.",
        size: "OS",
        image: "Logo Hat",
        featured: false,
    },
    { 
        category: "Art", 
        name: "Unique Painting 2",
        price: 133.00, 
        description: "Unique Painting 2",
        size: "n/a",
        image: "Unique Painting 2",
        featured: true,
    },
    { 
        category: "Accessories", 
        name: "Magic Keyring",
        price: 12.00, 
        description: "Magic Keyring",
        size: "n/a",
        image: "Magic Keyring",
        featured: false,
    },
]

await ItemModel.deleteMany()
console.log('Deleted entries')
await ItemModel.insertMany(items)
console.log('Added entries')

closeConnection()