import app from '../app.js'; // Ensure this correctly points to your Express app
import request from 'supertest';
import { ItemModel } from '../db'; // Make sure this path is correct

// Define a mock item object to use in tests, simulating a real item that could be added to the database.
const mockItem = {
    // _id: undefined,
    category: 'Test Category',
    name: 'Test Item',
    description: 'This is a mock item used for testing.',
    size: 'S',
    image: 'https://firebasestorage.googleapis.com/v0/b/shopfront-f3674.appspot.com/o/images%2Ftest-image.pngcf3a73f2-c244-4697-8b62-25ad8c43e6fb?alt=media&token=c301d69d-9f10-4514-89cd-06b2fa8a45b8',
    price: 9.99,
    featured: true,
};

describe("Item Routes", () => {

    let createdItemId

      // beforeEach hook runs before each test in this suite, creating a new item in the database.
    beforeEach(async () => {
        const insertedItem = await ItemModel.create(mockItem) // Insert the mock item into the database.
        createdItemId = insertedItem._id.toString() // Store the created item's ID to use in subsequent tests.
    })

    // afterEach hook runs after each test, cleaning up by deleting the created item from the database.
    afterEach(async () => {
        await ItemModel.findByIdAndDelete(createdItemId) // Delete the item by its ID.
    })

    // Test to verify that GET /items returns all items.
    test('GET /items should return all items', async () => {
        const res = await request(app).get('/items') // Make a GET request to fetch all items.
        expect(res.statusCode).toBe(200) // Expect a 200 OK response.
        expect(res.header['content-type']).toContain('application/json') // Ensure the response is in JSON format.
        expect(res.body.length).toBeGreaterThan(0) // Check that the response contains one or more items.
    })

    // Test to verify fetching a single item by its ID.
    test('GET /items/:id should return an item by its id', async () => {
        const response = await request(app).get(`/items/${createdItemId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBe(mockItem.name) // Verify the fetched item's name matches the mock item's name.
    });

    // Test to verify creating a new item.
    test('POST /items should create a new item', async () => {
        const newItem = {
            ...mockItem,
            name: 'Unique Test Item Name'
        };

        const response = await request(app)
            .post('/items')
            .send(newItem)

        expect(response.statusCode).toBe(201) // Expect a 201 Created response.
        expect(response.body).toHaveProperty('_id') // Ensure the response includes an '_id' property.
        createdItemId = response.body._id // Update the createdItemId with the new item's ID.
    });

    // Test to verify updating an item.
    test('PUT /items/:id should update the item', async () => {
        // Pre-check to ensure there is an item ID to update.
        if (!createdItemId) {
            throw new Error('No item ID set. Make sure POST /items test runs successfully before this test.')
        }

        const updates = { // Define updates to apply to the item.
            name: "Updated Name",
            description: "This is an updated description.",
        };

        const res = await request(app)
            .put(`/items/${createdItemId}`) // Make a PUT request to update the item by its ID.
            .send(updates) // Send the updates in the request body.

        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe(updates.name) // Verify the item's name was updated.
        expect(res.body.description).toBe(updates.description) // Verify the item's description was updated.
    });

    // Test to verify deleting an item.
    test('DELETE /items/:id should delete the mock item', async () => {
        // Pre-check to ensure there is an item ID to delete.
        if (!createdItemId) {
            throw new Error('Item ID not set. Make sure POST /items test runs successfully before this test.')
        }

        const deleteResponse = await request(app)
            .delete(`/items/${createdItemId}`) // Make a DELETE request to remove the item by its ID.

        expect(deleteResponse.statusCode).toBe(204)

         // Verify the item is no longer accessible.
        const fetchResponse = await request(app).get(`/items/${createdItemId}`)
        expect(fetchResponse.statusCode).toBe(404)
    });
});

