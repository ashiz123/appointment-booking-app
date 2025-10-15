import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';
import { getDb } from "../../src/shared/config/db.js";





describe("user" , () => {


    const body = {
            "username": "pukar",
            "email": "pukar@gmail.com",
            "password": "123456"
        }

   beforeEach(async() => {
    const db = getDb();
    await db.collection("users").deleteMany({});
    })


    it('should register the new user' , async() => {
       
         const res = await request(app)
         .post('/users/register' )
         .set('Accept', 'application/json')
         .send(body);

        

         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('message' , 'User registered succcessfully');
         expect(res.body.user).toMatch(/^[0-9a-fA-F]{24}$/);
    });


    it('should not allow duplicate email', async() => {

        const db = getDb();
        await db.collection('users').insertOne(body); //inserted here
        const res = await request(app)
         .post('/users/register' )
         .set('Accept', 'application/json')
         .send(body);

        console.log('Response user again', res.body, res.statusCode);
         expect(res.statusCode).toBe(400);
         expect(res.body).toHaveProperty('message' , 'User already exist');


    });
})
