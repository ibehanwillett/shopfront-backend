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

const authResponse = await request(app)
.post('/user/login')
.send(adminAccount)


describe("app test", () => {
    test('GET /', async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toContain('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toBe('Shopfront Backend')
    })

    describe('GET /users' , () => {
        let res 

        beforeEach(async () => {
            res = await request(app).get('/users')
        })

        test ('return JSON content', async () => {
            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain('json')
        })

        test ('return an array', async () => {
            expect(res.body).toBeInstanceOf(Array)
        })

        test ('array has three elements', async () => {
            expect(res.body).toHaveLength(3)
        })

        test ('array contains Nicole Nightmare', async () => {
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ email: "nicole@nightmare.com" })]))
        })
    })

    describe('POST /users/login' , () => {
        let res

        beforeAll(async () => {
            res = await request(app).post('/users/login').send(adminAccount)
        })

        test ('return JSON content', async () => {
            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain("json; charset=utf-8")
        })

        test ('access authorized routes', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/meow')
            .set('Cookie', cookies)
            .send()
            .expect(200)

        })

    describe('users can log in, access authorised pages and log out', () => {

        let res

        beforeEach(async () => {
            res = await request(app).post('/users/login').send(normalAccount)
        })

        test ('non admin users are denied access to meow', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/meow')
            .set('Cookie', cookies)
            .send()
            .expect(401)
        }) 

        test('authorized users can access to pages' , async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/bark/65d6ec9890bc6be386af2226')
            .set('Cookie', cookies)
            .send()
            .expect(200)
        })

        test('authorized users can log out' , async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/logout')
            .set('Cookie', cookies)
            .send()
            .expect(200)
        })
    })
    })

    // describe('a user can create and delete their account', () => {

    //     let res

    //     test('a user can create their account', async () => {
    //         res = await request(app).post('/users').send(trialAccount)
    //         expect(res.status).toBe(201)
    //         expect(res.body.email).toBeDefined()
    //         expect(res.body.email).toBe('foo@bar.com')
    //     })

    //     afterAll(async () => {
    //         let trialUser = await UserModel.findOne({email: "foo@bar.com"})
    //         res = await request(app).post('/users/login').send({email: "foo@bar.com", password: "spam"})
    //         const cookies = res.headers['set-cookie']
    //         request(app).delete(`/users/${trialUser._id}`)
    //     })

    // })


    // describe('users can update their account', () => {

    //     test('authorized users can update their account' , async () => {
    //         let res = await request(app).post('/users/login').send(normalAccount)
    //         const cookies = res.headers['set-cookie']
    //         let updatedUser = await UserModel.findOne({email: normalAccount.email})
    //         console.log(updatedUser)
    //         res = await request(app).patch(`/users/${updatedUser._id}`)
    //         .set('Cookie', cookies)
    //         .send({email: "horsethejor@mayor.com"})
    //         .expect(201)
    //     })
    //     test ('array contains updated email', async () => {
    //         let res = await request(app).get('/users')
    //         expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ email: "horsethejor@mayor.com" })]))
    //     })
    // })

})