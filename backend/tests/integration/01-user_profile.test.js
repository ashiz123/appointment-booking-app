import request from "supertest";
import app from "../../app.js";



describe('User profile', () => {

      const body = {
            "username": "sagar",
            "email": "sagar@gmail.com",
            "password": "123456"
        }
        let token;

    beforeAll( async() => {

        try{
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

    it('should display the profile', async() => {
        
        const userProfile = await request(app).get('/users/profile' ).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(userProfile.statusCode).toBe(200);
        expect(userProfile.body).toEqual({
            success: true,
            status: 200,
            data: expect.objectContaining({
                username : 'sagar',
                email : 'sagar@gmail.com'
            })
            
    });
        
    });


    it('should failed to display profile if wrong token', async() => {
        token = '2342342334';
        const userProfile = await request(app).get('/users/profile' ).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(userProfile.statusCode).toBe(401);
        expect(userProfile.body.message).toEqual('Invalid token')
    })


});