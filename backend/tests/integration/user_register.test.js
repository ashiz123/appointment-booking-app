import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';






describe("User register successful" , () => {
       const body = {
            "username": "pukar",
            "email": "pukar@gmail.com",
            "password": "123456"
        }
        beforeEach(async () => {
        await global.db.collection('users').deleteMany({});
        });

 

        

    it('should register the new user' , async() => {
         const res = await request(app)
         .post('/users/register' )
         .set('Accept', 'application/json')
         .send(body);

         console.log('response', res.body, res.statusCode);

         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('message' , 'User registered succcessfully');
         expect(res.body.user).toMatch(/^[0-9a-fA-F]{24}$/);
    });


    it('should not allow duplicate email', async() => {
        await global.db.collection('users').insertOne(body); //inserted here
        const res = await request(app)
         .post('/users/register' )
         .set('Accept', 'application/json')
         .send(body);

        console.log('Response user again', res.body, res.statusCode);
         expect(res.statusCode).toBe(400);
         expect(res.body).toHaveProperty('message' , 'User already exist');


    });
})


    describe('User register validation failed',  () => {
    it('should return invalid email', async() => {

         const body = {
                "username": "pukar",
                "email": "pukar",
                "password": "123456"
            }

        const res = await request(app)
        .post('/users/register')
        .set('Accept', 'application/json')
        .send(body);
    
        console.log('validation error', res.body, res.statusCode);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path : "email" , msg : "Invalid email" })
            ]) 
        )
    });


    it('should return username required', async() => {
        const body =  {
            "username" : "",
            "email" : "pukar@gmail.com",
            "password" : "123456"
        }

        const res = await request(app)
        .post('/users/register')
        .set("Accept", 'application/json')
        .send(body);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path : "username", msg: "Username is required"})
            ])
        )
    })
    })
