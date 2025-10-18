import request from 'supertest';
import app from '../../app.js';
import { ObjectId } from 'mongodb';




describe('Appointment slot route test', () => {
    let businessOfferId;
    let businessId;
    let userId = '68e699a649500a709aa9b8c3';


     beforeEach(async() => {
        await global.db.collection('appointment_slots').deleteMany({});
        await global.db.collection('business_offer').deleteMany({});
        await global.db.collection('business').deleteMany({});
        
        
        const businessResult = await global.db.collection('business').insertOne({
            ownerId: new ObjectId(userId),   // <-- very important
            name: 'Test Business',
            address: '123 Street',
            start_time: '09:00',
            end_time: '17:00',
        });

        

        businessId = businessResult.insertedId

         const businessOfferResult = await global.db.collection('business_offer').insertOne({
            businessId: businessId,  
            name: 'Test Offer',
            description: 'Sample offer',
            price: 45,
            duration: 30,
        });

        businessOfferId = businessOfferResult.insertedId

  })

  it('should create the appointment slots', async() => {
       const appointmentSlot = {
        "business_id" :  businessId.toString(), 
        "service_id" :  businessOfferId.toString(),
        "business_start": "09:00",
        "business_end" : "17:00",
        "service_duration":  "30",
        "date" : "2025-12-03",
        "seats" : "5"
        }

       const res = await request(app)
       .post('/business/appointment_slot/create')
       .set('Accept', 'application/json')
       .set('Authorization', 'Bearer valid_token_123')
       .send(appointmentSlot);

       expect(res.statusCode).toBe(200);
       expect(res.body).toHaveProperty('slots');
       expect(res.body.slots.length).toBeGreaterThan(0);
       expect(Array.isArray(res.body.slots)).toBe(true);
        
    }); 


    it('should display error: Business is not belong to authenticated user', async() => {
       const appointmentSlot = {
        "business_id" : '68c07197927458da1b9de146', 
        "service_id" : '68c146a4b05b690ff56bbeab',
        "business_start": "09:00",
        "business_end" : "17:00",
        "service_duration":  "30",
        "date" : "2025-12-03",
        "seats" : "5"
        }

       const res = await request(app)
       .post('/business/appointment_slot/create')
       .set('Accept', 'application/json')
       .set('Authorization', 'Bearer valid_token_123')
       .send(appointmentSlot);


       expect(res.statusCode).toBe(500);
       expect(res.body.message).toEqual('Business is not belong to authenticated user');
       
    }); 


  



})