import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';



describe('User login', () => {

      const USER_CREDENTIALS = {
             "username": "pukar",
             "password": "123456"
        }

      const REGISTER_USER = {
            ...USER_CREDENTIALS,
            "email": "pukar@gmail.com",
            
      }  

      beforeEach(async() => {
        await global.db.collection('users').deleteMany({});
        await request(app)
        .post('/users/register')
         .send(REGISTER_USER)
         .expect(200)
      }); 


    it('should successfully login registered user', async() => {
        const res = await request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(USER_CREDENTIALS);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual('Login successful');
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.token.length).toBeGreaterThan(10);
      
    });


    it('should return wrong password ', async() => {
      const WRONG_CREDENTIALS = {
        "username" : "pukar",
        "password" : "testingwrong"
      }

      const res = await request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(WRONG_CREDENTIALS);

        expect(res.body.message).toEqual('Wrong password');
        expect(res.statusCode).toEqual(401);
    })

    


})


describe('User login validation', () => {
      it('should show username required ' , async() => {
        const loginBody = {
          'username' : "",
          'password' : "123456"
        }


        const res = await request(app)
        .post('/users/login')
        .set('Accept' ,'application/json')
        .send(loginBody)

       
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({path : 'username', msg : 'Username is required'}),
            expect.objectContaining({path : 'username', msg : 'Username must be only letters'})
          ]))
        
      })
})