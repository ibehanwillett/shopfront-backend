import app from '../app.js'
import request from 'supertest'
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

    describe('unauthorised users cannot access authorised pages', () => {

        let res

        beforeAll(async () => {
            res = await request(app).post('/users/login').send(normalAccount)
        })

        test ('unauthorized users are denied access meow', async () => {
            const cookies = res.headers['set-cookie']
            res = await request(app).get('/users/meow')
            .set('Cookie', cookies)
            .send()
            .expect(401)
        })
    })
    })

    })