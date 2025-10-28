import request from 'supertest';
import app from '../../app.js';
import { ObjectId } from 'mongodb';



describe('Booking appointment successful', () => {

    let appointmentSlotId;
    let businessId;
    let serviceId;

    beforeEach(async() => {
      
        await global.db.collection('business_offer').deleteMany({});
        await global.db.collection('business').deleteMany({});
        await global.db.collection('booking_slot').deleteMany({});

        const userId = new ObjectId(); //fake user 

        const business = await global.db.collection('business').insertOne({
            owner: userId,   // <-- very important
            name: 'Test Business',
            address: '123 Street',
            start_time: '09:00',
            end_time: '17:00',
        });

        businessId = business.insertedId;
        console.log('business id', businessId);

        const businessOfferResult = await global.db.collection('business_offer').insertOne({
            businessId,
            name: 'Haircut',
            description: '30-min cut',
            price: 25,
            duration: 30,
                    
        });

          serviceId = businessOfferResult.insertedId;
          console.log('service id', serviceId);
        });


        afterEach(async() => {
            await global.db.collection('appointment_slots').deleteMany({});
        })

      

   it('should book the appointment successfully', async() => {

        const appointmentSlotResult  = await global.db.collection('appointment_slots').insertOne({
             business_id : businessId,
             service_id  : serviceId,
             slot_start :  new Date('2025-12-02T09:00:00.000Z'),
             slot_end : new Date('2025-12-02T09:30:00.000Z'),
             status : "available",
             booked : 0,
             total_seats : 2
          });


          appointmentSlotId = appointmentSlotResult.insertedId;

         const BOOKING_DETAIL = {
                "appointment_slot_id" : appointmentSlotId.toString(),
                "fullname" : "bom shah",
                "email" : "bom@gmail.com",
                "phone" : "9088089207",
                "status" : "booked"
            } 


            const res = await request(app)
            .post('/customer/book_appointment')
            .set('Accept', 'application/json')
            .send(BOOKING_DETAIL)

            console.log(res.body, res.statusCode);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Slot booked successfully');


    });


    it('should display date must be greater than current date or time', async() => {


          const pastDateAppointmentSlot  = await global.db.collection('appointment_slots').insertOne({
             business_id : businessId,
             service_id  : serviceId,
             slot_start :  new Date('2024-12-02T09:00:00.000Z'), //less than current date and time
             slot_end : new Date('2024-12-02T09:30:00.000Z'),
             status : "available",
             booked : 0,
             total_seats : 2
           });

           const pastDateAppointmentSlotId = pastDateAppointmentSlot.insertedId;

            const BOOKING_DETAIL = {
                "appointment_slot_id" : pastDateAppointmentSlotId.toString(),
                "fullname" : "bom shah",
                "email" : "bom@gmail.com",
                "phone" : "9088089207",
                "status" : "booked"
            } 


            const res = await request(app)
            .post('/customer/book_appointment')
            .set('Accept', 'application/json')
            .send(BOOKING_DETAIL)

            console.log(res.body, res.statusCode);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Date must be greater than current date and time');
    })




})


