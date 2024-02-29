import { ItemModel } from "../db.js"
import { Router } from "express"


const router = Router()


// Define a GET route to fetch all items from the database.
router.get('/', async (req, res, next) => {
    try {
        // Use the find method on ItemModel to retrieve all items.
        const items = await ItemModel.find()
        // Send the retrieved items back to the client.
        res.send(items)
    } catch (err) {
        // Pass any errors that occur to the error handling middleware.
        next(err)
    }
})

// Define a GET route to fetch a single item by its ID.
router.get('/:id', async (req, res, next) => {
    try {
        // Use the findById method on ItemModel to retrieve an item by its ID.
        const entry = await ItemModel.findById(req.params.id)
        if (entry) {
            // If the item is found, send it back to the client.
            res.send(entry)
        } else {
            // If the item is not found, respond with a 404 Not Found status and an error message.
            res.status(404).send({ error: 'Entry not found' })
        }
    } catch (err) {
        // Pass any errors that occur to the error handling middleware.
        next(err)
    }
})

// Define a POST route to create a new item.
router.post('/', async (req, res) => {
    try {
        // Use the create method on ItemModel to insert a new item into the database.
        const insertedEntry = await (await ItemModel.create(req.body))//.populate('category')
        // Respond with a 201 Created status and the newly created item.
        res.status(201).send(insertedEntry)
    }
    catch (err) {
         // If an error occurs, respond with a 500 Internal Server Error status and the error message.
        res.status(500).send({ error: err.message })
    }
})

// Define a PUT route to update an existing item by its ID.
router.put('/:id', async (req, res, next) => {
    if (!req.body) {
        // If the request body is missing, respond with a 400 Bad Request status and an error message.
        return res.status(400).send({ error: 'Request body is required' })
    }

    try {
        // Use the findByIdAndUpdate method to update the item and return the updated document.
        const updatedEntry = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updatedEntry) {
            // If the update is successful, send the updated item back to the client.
            res.send(updatedEntry)
        } else {
             // If the item to update is not found, respond with a 404 Not Found status and an error message.
            res.status(404).send({ error: 'Entry not found' })
        }
    } catch (err) {
         // Pass any errors that occur to the error handling middleware.
        next(err)
    }
})


// Define a DELETE route to remove an item by its ID.
router.delete('/:id', async (req, res, next) => {
    try {
         // Use the findByIdAndDelete method to remove the item from the database.
        const deletedEntry = await ItemModel.findByIdAndDelete(req.params.id);
        if (deletedEntry) {
             // If the deletion is successful, respond with a 204 No Content status.
            res.sendStatus(204)
        } else {
             // If the item to delete is not found, respond with a 404 Not Found status and an error message.
            res.status(404).send({ error: 'Entry not found' })
        }
    } catch (err) {
        // Pass any errors that occur to the error handling middleware.
        next(err)
    }
})

// General error handling middleware for the router.
router.use((err, req, res, next) => {
    // Log the error to the console for debugging purposes.
    console.error(err);
    // Determine the HTTP status code: use the status from the error if it exists, otherwise default to 500.
    const status = err.status || 500;
    // Determine the error message: use the message from the error if it exists, otherwise default to a generic message.
    const message = err.message || 'An unexpected error occurred';
    // Respond with the determined status and a JSON object containing the error message.
    res.status(status).json({ error: message });
});

export default router 