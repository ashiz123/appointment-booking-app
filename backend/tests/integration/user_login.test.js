import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';



describe('User login', () => {

      const loginBody = {
             "username": "pukar",
              "password": "123456"
        }

      const registerBody = {
           "username": "pukar",
            "email": "pukar@gmail.com",
            "password": "123456"
      }  

      beforeEach(async() => {
        await global.db.collection('users').deleteMany({});
        await request(app)
        .post('/users/register')
        .set('Accept','application.json')
        .send(registerBody);
      }); 


    it('should login user', async() => {
        const res = await request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(loginBody);

      
        console.log('Response from login test', res.body, res.statusCode);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.user).toBe('object');
        expect(res.body.user).toEqual({
          username: 'pukar', email: 'pukar@gmail.com' 
        });
        //token validate check
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body.token.length).toBeGreaterThan(10);
    })
})