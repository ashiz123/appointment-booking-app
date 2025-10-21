import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';




describe("Test create business", () => { 

    beforeEach(async() => {
       await global.db.collection("business").deleteMany({});
    });

  
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

         

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual('Business created successfully');
        });
  })

  

  


describe('Test business offer', () => {

    const business = {
        "name" : "hari business",
        "address" : "137 shorncliffe road",
        "start_time" : "09:00",
        "end_time" : "17:00"
    }

    let newBusiness;

    beforeEach(async() => {
        //clear the business first
        //before businessoffer, we need business created
          try{
              await global.db.collection('business').deleteMany({}); 
              await global.db.collection('business_offer').deleteMany({});
              newBusiness = await global.db.collection('business').insertOne(business);
          }
          catch(error){
            console.error('Error in before each, running test to create business offer', error);
            throw error;
          }
    })

  
  it('Business offer created successfully', async() => {
        const businessOfferData  = {
            "name": "sam Hair color",
            "description": "A detailed haircut with scalp massage and styling.",
            "businessId": newBusiness.insertedId,
            "price": 45,
            "duration" : 30
        }

        const res = await request(app)
            .post('/business/offer/create')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer valid_token_123')
            .send(businessOfferData)
            
           

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(  res.body.message).toBe('Success');
            
    });
})

