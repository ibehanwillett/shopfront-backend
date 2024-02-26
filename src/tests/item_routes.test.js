import app from '../app.js'; // Ensure this correctly points to your Express app
import request from 'supertest';
import { ItemModel } from '../db'; // Make sure this path is correct

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

    beforeEach(async () => {
        const insertedItem = await ItemModel.create(mockItem)
        createdItemId = insertedItem._id.toString()
    })

    afterEach(async () => {
        await ItemModel.findByIdAndDelete(createdItemId)
    })

    test('GET /items should return all items', async () => {
        const res = await request(app).get('/items')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toContain('application/json')
        expect(res.body.length).toBeGreaterThan(0)
    })

    test('GET /items/:id should return an item by its id', async () => {
        const response = await request(app).get(`/items/${createdItemId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBe(mockItem.name)
    });

    test('POST /items should create a new item', async () => {
        const newItem = {
            ...mockItem,
            name: 'Unique Test Item Name'
        };

        const response = await request(app)
            .post('/items')
            .send(newItem)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('_id')
        createdItemId = response.body._id
    });

    test('PUT /items/:id should update the item', async () => {
        if (!createdItemId) {
            throw new Error('No item ID set. Make sure POST /items test runs successfully before this test.')
        }

        const updates = {
            name: "Updated Name",
            description: "This is an updated description.",
        };

        const res = await request(app)
            .put(`/items/${createdItemId}`)
            .send(updates);

        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe(updates.name)
        expect(res.body.description).toBe(updates.description)
    });

    test('DELETE /items/:id should delete the mock item', async () => {
        if (!createdItemId) {
            throw new Error('Item ID not set. Make sure POST /items test runs successfully before this test.')
        }

        const deleteResponse = await request(app)
            .delete(`/items/${createdItemId}`)

        expect(deleteResponse.statusCode).toBe(204)

        const fetchResponse = await request(app).get(`/items/${createdItemId}`)
        expect(fetchResponse.statusCode).toBe(404)
    });
});

