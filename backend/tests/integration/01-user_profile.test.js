import request from "supertest";
import app from "../../app.js";
import { redisClient } from "../../src/shared/config/redisClient.js";



describe('User profile', () => {

      const body = {
            "username": "sagar",
            "email": "sagar@gmail.com",
            "password": "123456"
        }
        let token;
        let withRedis;
        let withoutRedis;

    beforeAll( async() => {

        try{
            await redisClient.flushAll();
            await global.db.collection('users').deleteMany();
            const registerUser = await request(app).post('/users/register' ).set('Accept', 'application/json').send(body);
            expect(registerUser.status).toBe(200);
            const loginUser =  await request(app).post('/users/login' ).set('Accept', 'application/json').send({email : body.email, password: body.password});
            token = loginUser.body.data.token;
            expect(token).toBeTruthy();
        }
        catch(err){
            console.log('Setup register/login failed in user profile test', err.message);
        }
     });

    it('should display the profile and cache should be false', async() => {
        
        const responseStartTime = Date.now();
        const userProfile = await request(app).get('/users/profile' ).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
        const responseEndTime =  Date.now();
        withoutRedis  = responseEndTime - responseStartTime;
        console.log('response with redis false', withoutRedis);
       

        expect(userProfile.statusCode).toBe(200);
        expect(userProfile.body).toEqual({
            success: true,
            cached : false, 
            status: 200,
            data: expect.objectContaining({
                username : 'sagar',
                email : 'sagar@gmail.com'
            })
            
    });
});

    it('should display the profile and cache should be true', async() => {
        
        const responseStartTime = Date.now();
        const userProfile = await request(app).get('/users/profile' ).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
        const responseEndTime =  Date.now();
        withRedis  = responseEndTime - responseStartTime;
        console.log('response with redis true', withRedis);
        

        expect(userProfile.statusCode).toBe(200);
        expect(userProfile.body).toEqual({
            success: true,
            cached : true, 
            status: 200,
            data: expect.objectContaining({
                username : 'sagar',
                email : 'sagar@gmail.com'
            })
            
    });
});

    it('should display redis is quicker', ()=> {
        expect(withoutRedis > withRedis).toBe(true);
    })



    it('should failed to display profile if wrong token', async() => {
        token = '2342342334';
        const userProfile = await request(app).get('/users/profile' ).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(userProfile.statusCode).toBe(401);
        expect(userProfile.body.message).toEqual('Invalid token')
    })



});