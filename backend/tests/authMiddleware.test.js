import express from 'express';
import request from 'supertest'; 
import app from '../app.js';
import { jwtService } from '../src/shared/services/jwtServices.js';
import { connect } from '../src/shared/config/db.js';



//when I am using beforeAll, there is issue. beforeAll is not execution. test this first

beforeAll(() => {
    console.log('connection called')
    try{
            connect()
    }catch(err){
         console.log('Error connection', err.message)
    }

})

afterAll(() => {
    console.log('After all called');
})



describe('Auth middleware', () => {


     it('should return 400  validation error', async () => {
        const response = await request(app).post('/business/create')
         .send({name :"ashiz" , address : "123 biggins wood road", email : "ash@gmail.com", start_time : "09:00"})
         expect(response.status).toBe(400);
         expect(response.body.errors).toEqual([{"location": "body", "msg": "End time is required", "path": "end_time", "type": "field"}]);
      
    });


    it('should return 401 when no token is provided', async () => {
        const response = await request(app).post('/business/create')
        .send({name :"ashiz" , address : "123 biggins wood road", email : "ash@gmail.com", start_time : "09:00", end_time : "15:00"});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({message : "No token provided"});
    });


    it("should access when token is provided", async() => {
        const payload = {userId : 1};
        const token = jwtService.sign(payload);

        console.log("generated token" , token);
        
       const response = await request(app)
        .post('/business/create')
        .set('Authorization',  `Bearer ${token}`)
        .send({name :"ashiz" , address : "123 biggins wood road", email : "ash@gmail.com", start_time : "09:00", end_time : "15:00"});

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Business created successfully");

        })
    })



    
    
 



