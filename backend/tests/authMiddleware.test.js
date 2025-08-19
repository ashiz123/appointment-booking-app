import express from 'express';
import request from 'supertest'; 
import app from '../app.js';
import { jwtService } from '../src/shared/services/jwtServices.js';

//install babel to support test with ES modules. 

describe('Auth middleware', () => {
    it('should return 401 when no token is provided', async () => {
        const response = await request(app).get('/appointment/create'); // no header
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'No token provided' });
    });
    
    
    it('should display middleware passed', async() => {
 
        const payload = {
            userId: 123,
            username: 'Ashizhamal',
            email: 'ashizhamal@gmail.com'
         };

        const token =  jwtService.sign(payload);


        //token passed here
        const response = await request(app)
        .get('/appointment/create')
        .set('Authorization', `Bearer ${token}`);
        // expect(response.status).toBe(200);
        expect(response.body).toEqual('middleware passed');
    });
})