import app from '../app.js'
import request from 'supertest'

describe("app test", () => {
    // This test is checking the behavior of the application's root route ('GET /').
    test('GET /', async () => {
        const res = await request(app).get('/')
        // Expect the HTTP status code to be 200, indicating a successful response.
        expect(res.status).toBe(200)
        
        // Expect the 'Content-Type' header of the response to indicate that the response body is in JSON format.
        expect(res.header['content-type']).toContain('json')
        
        // Expect the response body to have an 'info' property, ensuring that the necessary data structure is returned.
        expect(res.body.info).toBeDefined()
        
        // Finally, expect the value of the 'info' property to be 'Shopfront Backend', verifying the response content.
        expect(res.body.info).toBe('Shopfront Backend')
    })


    })