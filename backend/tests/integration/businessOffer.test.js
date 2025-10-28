import request from "supertest";
import app from "../../app.js";
import '../setup/setup.js';
import {ObjectId} from 'mongodb';


describe('Test create business offer', () => {

    const business = {
        "name" : "hari business",
        "address" : "137 shorncliffe road",
        "start_time" : "09:00",
        "end_time" : "17:00"
    }

    let newBusiness;
    let businessOfferId;

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
            
           
            businessOfferId =  res.body.data;

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.message).toBe('Business offer created successfully');
            
    });
});

describe('Failure updating and deleting business offer', () => {

    const nonAuthUser  =  new ObjectId('68ffdda668bfb789d5fa6e9f')

    const business = {
        "name" : "hari business",
        "owner" : nonAuthUser,
        "address" : "137 shorncliffe road",
        "start_time" : "09:00",
        "end_time" : "17:00"
    }

    let newBusiness;
    let businessOfferId;

    beforeEach(async() => {
        //clear the business first
        //before businessoffer, we need business created
          try{
              await global.db.collection('business').deleteMany({}); 
              await global.db.collection('business_offer').deleteMany({});
              newBusiness = await global.db.collection('business').insertOne(business);
              const businessOfferData  = {
                "name": "sam Hair color",
                "description": "A detailed haircut with scalp massage and styling.",
                "businessId": newBusiness.insertedId,
                "price": 45,
                "duration" : 30
            }
            const newBusinessOffer = await global.db.collection('business_offer').insertOne(businessOfferData);
            businessOfferId = newBusinessOffer.insertedId.toString();
          }
          catch(error){
            console.error('Error in before each, running test to create business offer', error);
            throw error;
          }
    })

    it('should response the error of no any data provided', async() => {
        const offerData = { }

        const res = await request(app).put(`/business/offer/update/${businessOfferId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123')
                    .send(offerData) ;

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            statusCode : 404,
            message : "Resource doesn't exist",
            code : "ResourceDoesntExist",
            errors: [
                expect.objectContaining({
                    type : 'field',
                    path : 'businessOfferRepository',
                    msg : 'No any data provided'
                })
            ]
        });
    });

    it('should response the validation error, invalid business offer id', async() => {
        const offerData = {
            "name" : "Folkestone hair cut"
        }

        const res = await request(app).put('/business/offer/update/123')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123')
                    .send(offerData) ;
                    
        expect(res.statusCode).toBe(400); 
        expect(res.body).toEqual({
            success:false,
            errors : [
                expect.objectContaining({
                    type : 'field',
                    value : '123',
                    msg: 'Invalid business offer id',
                    path: 'offerId',
                    location: 'params'
                })
            ],
            message : 'Validation error'
        })
    });

    it('Unauthorised user not allowed to update the business offer', async() => {
          const offerData = {
            "name" : "Folkestone hair cut"
         }

         const res = await request(app).put(`/business/offer/update/${businessOfferId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123')
                    .send(offerData) ;


        expect(res.statusCode).toBe(403);
        expect(res.body).toEqual({
            success: false,
            statusCode: 403,
            message: 'Not authorized',
            code: 'PermissionDenied',
            errors: [
                expect.objectContaining({
                type: 'authorization',
                path: 'businessRepository',
                msg: 'Business offer is not of authenticated user'
                })
            ]
    })
               
    });


    it('should not allow delete the business offer to unauthorised user', async() => {
         const res = await request(app).delete(`/business/offer/delete/${businessOfferId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123');

         expect(res.statusCode).toBe(403);
         expect(res.body).toEqual({
            success: false,
            statusCode: 403,
            message: 'Not authorized',
            code: 'PermissionDenied',
            errors: [
                expect.objectContaining({
                type: 'authorization',
                path: 'businessRepository',
                msg: 'Business offer is not of authenticated user'
                })
            ]
    })
    })
});

describe('Successfully update and delete business by authenticated user', () => {

    const authenticatedUser = new ObjectId('68e699a649500a709aa9b8c3')

    const business = {
        "name" : "hari business",
        "owner" : authenticatedUser,
        "address" : "137 shorncliffe road",
        "start_time" : "09:00",
        "end_time" : "17:00"
    }

    let newBusiness;
    let businessOfferId;

    beforeEach(async() => {
        //clear the business first
        //before businessoffer, we need business created
          try{
              await global.db.collection('business').deleteMany({}); 
              await global.db.collection('business_offer').deleteMany({});
              newBusiness = await global.db.collection('business').insertOne(business);
              const businessOfferData  = {
                "name": "sam Hair color",
                "description": "A detailed haircut with scalp massage and styling.",
                "businessId": newBusiness.insertedId,
                "price": 45,
                "duration" : 30
            }
            const newBusinessOffer = await global.db.collection('business_offer').insertOne(businessOfferData);
            businessOfferId = newBusinessOffer.insertedId.toString();
          }
          catch(error){
            console.error('Error in before each, running test to create business offer', error);
            throw error;
          }
    });



      it('should update business offer successfully', async() => {
        const updateData = {
            "name" : "Testing company",
            "description" : "This is testing company"
        }

         const res = await request(app).put(`/business/offer/update/${businessOfferId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123')
                    .send(updateData) ;


        console.log(res.body);  
        expect(res.statusCode).toBe(200);    
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Business offer updated successfully');     
    });


    it('should delete the business offer successfully', async() => {
          const res = await request(app).delete(`/business/offer/delete/${businessOfferId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer valid_token 123');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual('Business offer deleted successfully');
                    
    })



});

