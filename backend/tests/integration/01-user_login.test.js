import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';



describe('User login', () => {

      const USER_CREDENTIALS = {
             "email": "pukar@gmail.com",
             "password": "123456"
        }

      const REGISTER_USER = {
            "username": "pukar",
            "email": "pukar@gmail.com",
            "password": "123456"
      }  

      beforeAll(async() => {
        await global.db.collection('users').deleteMany({});
        await request(app)
        .post('/users/register')
         .send(REGISTER_USER)
         .expect(200)
      }); 


  


    it('should return wrong password ', async() => {
      const WRONG_CREDENTIALS = {
        "email" : "pukar@gmail.com",
        "password" : "testingwrong"
      }

      const res = await request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(WRONG_CREDENTIALS);

        expect(res.body.message).toEqual('Wrong password');
        expect(res.statusCode).toEqual(401);
    });


      it('should successfully login  user', async() => {
        const res = await request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(USER_CREDENTIALS);
        

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual('Login successful');
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.token.length).toBeGreaterThan(10);
      
    });

    


})


    describe('User login validation', () => {
      it('should show email required ' , async() => {
        const loginBody = {
          'email' : "",
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
            expect.objectContaining({path : 'email', msg : 'Email is required'}),
            expect.objectContaining({path : 'email', msg : 'Invalid email'})
          ]))
        
      })
})