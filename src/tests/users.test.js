import app from '../app.js'
import request from 'supertest'
import { UserModel } from '../db.js'
// import superagent from 'superagent'

const agent = request.agent(app)
// const agent = superagent.agent(app)

const adminAccount = {
    email: "nicole@nightmare.com",
    password: "imanartist"
}

const normalAccount = {
    email: "horse@jorsington.com",
    password: "mayorhorse"
}

const trialAccount = {
    email: "foo@bar.com",
    first: "foo",
    last: "bar",
    password: "spam"
}

// Authenticate an admin account before running tests.
const authResponse = await request(app)
.post('/user/login')
.send(adminAccount)

// Define a test suite for the application.
describe("app test", () => {

    // Test the root route GET '/' for basic response validation.
    test('GET /', async () => {
        // Make a GET request to the root route.
        const res = await request(app).get('/')
        // Check if the response status is 200 OK.
        expect(res.status).toBe(200)
        // Check if the content type of the response is JSON.
        expect(res.header['content-type']).toContain('json')
        // Ensure the response body contains specific information.
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toBe('Shopfront Backend')
    })

    // Define a nested suite to test the GET '/users' route.
    describe('GET /users', () => {
        let res // Declare a variable to store the response for use in multiple tests.

        // Use beforeEach to make a GET request before running each test in this suite.
        beforeEach(async () => {
            res = await request(app).get('/users')
        })

        // Test to ensure the response is in JSON format.
        test('return JSON content', async () => {
            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain('json')
        })

        // Test to confirm the response body is an array.
        test('return an array', async () => {
            expect(res.body).toBeInstanceOf(Array)
        })

        // Test to verify the array length, ensuring it has three elements.
        test('array has three elements', async () => {
            expect(res.body).toHaveLength(3)
        })

        // Test to check if the array contains a specific user.
        test('array contains Nicole Nightmare', async () => {
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ email: "nicole@nightmare.com" })]))
        })
    })

    // Define another suite to test the POST '/users/login' route.
    describe('POST /users/login', () => {
        let res // Declare a variable for response reuse.

        // Use beforeAll to login once before running the tests in this suite.
        beforeAll(async () => {
            res = await request(app).post('/users/login').send(adminAccount)
        })

        // Test to check the response type and status.
        test('return JSON content', async () => {
            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain("json; charset=utf-8")
        })

        // Test to verify access to authorized routes after login.
        test('access authorized routes', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/meow')
            .set('Cookie', cookies)
            .send()
            .expect(200)
        })

     // Nested describe block for testing login functionality, access control, and logout for non-admin users.
     describe('users can log in, access authorised pages and log out', () => {
        let res

        // Log in as a normal user before each test in this suite.
        beforeEach(async () => {
            res = await request(app).post('/users/login').send(normalAccount)
        })

        // Test to ensure non-admin users are denied access to specific routes (e.g., '/users/meow').
        test('non admin users are denied access to meow', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/meow')
            .set('Cookie', cookies)
            .send()
            .expect(401) // Expect a 401 Unauthorized status.
        })

        // Test to verify that authorized (logged-in) users can access certain pages.
        test('authorized users can access to pages', async () => {
            const cookies = res.headers['set-cookie']
            let jorsington = await UserModel.findOne({email: normalAccount.email})
            res = await request(app).get(`/users/bark/${jorsington._id}`)
            .set('Cookie', cookies)
            .send()
            .expect(200) // Expect a 200 OK status.
        })

        // Test to confirm that authorized users can successfully log out.
        test('authorized users can log out', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/logout')
            .set('Cookie', cookies)
            .send()
            .expect(200) // Expect a 200 OK status indicating successful logout.
        })
    })

    // Test suite for account creation and deletion functionalities.
    describe('a user can create and delete their account', () => {
        let res

        // Test to verify that a user can successfully create an account.
        test('a user can create their account', async () => {
            res = await request(app).post('/users').send(trialAccount)
            expect(res.status).toBe(201) // Expect a 201 Created status.
            expect(res.body.email).toBeDefined()
            expect(res.body.email).toEqual('foo@bar.com') // Confirm the account's email matches the input.
        })

        // Clean up after all tests in this suite; delete the newly created trial account.
        afterAll(async () => {
            let trialUser = await UserModel.findOne({email: "foo@bar.com"})
            res = await request(app).post('/users/login').send({email: "foo@bar.com", password: "spam"})
            const cookies = res.headers['set-cookie']
            res = await request(app).delete(`/users/${trialUser._id}`)
            .set('Cookie', cookies)
            .expect(204) // Expect a 204 No Content status, indicating successful deletion.
        })
    })

    // Test suite for account update functionalities.
    describe('users can update their account', () => {
        // Test to confirm that authorized users can update their account information.
        test('authorized users can update their account', async () => {
            let res = await request(app).post('/users/login').send(normalAccount)
            const cookies = res.headers['set-cookie']
            let updatedUser = await UserModel.findOne({email: normalAccount.email})
            res = await request(app).patch(`/users/${updatedUser._id}`)
            .set('Cookie', cookies)
            .send({email: "horsethejor@mayor.com"})
            .expect(201) // Expect a 201 Created status, indicating successful update.
        })

        // Test to verify the users list contains the updated email after the account update.
        test('array contains updated email', async () => {
            let res = await request(app).get('/users')
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ email: "horsethejor@mayor.com" })]))
        })

        // Clean up after tests by resetting the updated user's email to its original value.
        afterAll(async () => {
            let res = await request(app).post('/users/login').send({
                email: "horsethejor@mayor.com",
                password: "mayorhorse"
            })
            const cookies = res.headers['set-cookie']
            let updatedUser = await UserModel.findOne({email: "horsethejor@mayor.com"})
            res = await request(app).patch(`/users/${updatedUser._id}`)
            .set('Cookie', cookies)
            .send({email: normalAccount.email})
            .expect(201) // Expect a 201 Created status, confirming the email has been reset.
        })
    })
})
})