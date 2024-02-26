import app from '../app.js'; // Ensure this correctly points to your Express app
import request from 'supertest';
import { ItemModel } from '../db'; // Make sure this path is correct

const mockItem = {
    _id: undefined,
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

    test('POST /items should create a new item', async () => {
        const response = await request(app)
            .post('/items')
            .send(mockItem)

        expect(response.statusCode).toBe(201)
        createdItemId = response.body._id
    })

    test('DELETE /items/:id should delete the mock item', async () => {

        if (!createdItemId) {
            throw new Error('Item ID not set. Make sure POST /items test runs successfully before this test.');
        }

        const deleteResponse = await request(app)
            .delete(`/items/${createdItemId}`)

        expect(deleteResponse.statusCode).toBe(204)

        const fetchResponse = await request(app).get(`/items/${createdItemId}`)
        expect(fetchResponse.statusCode).toBe(404)
    })

    test('POST /items should create a new item', async () => {
        const newItem = {
            ...mockItem,
            name: 'Unique Test Item Name'
        }

        const response = await request(app)
            .post('/items')
            .send(newItem)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('_id')
        
        createdItemId = response.body._id
    })

    // test('PUT /items should update the item', async () => {
    //     const updates = {
    //         name: 'Updated Name',
    //         category: 'Art',
    //     }
    // })

})

