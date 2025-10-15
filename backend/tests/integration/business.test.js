import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';




describe("Create business route", () => { 
   
    it('should create business after valid token', async() => {
         const body = {
        "name" : "sam business",
        "address" : "137 shorncliffe road",
        "start_time" : "09:00",
        "end_time" : "17:00"
        };

        const res = await request(app)
        .post('/business/create')
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer valid_token_123');

         console.log('Response:', res.statusCode, res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual('Business created successfully');
        })


    


})
