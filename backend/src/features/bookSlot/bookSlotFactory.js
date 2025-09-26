

import { ObjectId } from "mongodb";
import { buildBooking } from "./bookingSlotModel.js";
import { sendAppointmentEmail } from "../../shared/config/mailer.js"; 




export function bookSlotFactory(bookRepo, slotRepo){

    return {


            async bookSlot({appointment_slot_id, fullname, email, phone}){
          
             let result;
             let bookingResult;
             const slot_id = new ObjectId(appointment_slot_id);
             const isValidDateToBook = await slotRepo.isDateValid(slot_id);     

            if(!isValidDateToBook){
                return {success: false, status: 400, message: "Date must be greater than current date and time"};
            }

             const slotBooked = await bookRepo.slotAlreadyBooked(slot_id, email);
            
             console.log('slot booked', slotBooked);
             
             if (slotBooked) {
                return { success: false, status: 400, message: "Booking already exists for this user" };
             }

            

             try{
                 bookingResult = await bookRepo.bookingSlot(
                       buildBooking(slot_id, fullname, email, phone)
                 );

                 if(!bookingResult){
                    throw new Error("Booking could not be created");
                 }

                 const bookedSeat = await slotRepo.bookingSeat(slot_id);
                 if(bookedSeat.acknowledged && bookedSeat.modifiedCount > 0){
                    result = {success:true, status:200, message : "Slot booked successfully"};
                    await sendAppointmentEmail(email, fullname, bookingResult.slot_start, bookingResult.booking_reference);
                }
                else
                {
                   console.log('Cancel booking control is here');
                   await bookRepo.cancleBookedSlot(bookingResult.business_id);
                   result = {success : false,  status: 400, message: "Problem occured with appointment_slot update"};
                }

                return result;
            }
             catch(err){

               
                if(bookingResult?.insertedId){
                    bookRepo.cancleBookedSlot(bookingResult.insertedId);
                }
                return {success: false, status:409, message : err.message}
             }
            },
                   
                
         
            async rescheduleAppointment(booking_reference, slot_id){
             try{
                const previousBooking = await bookRepo.fetchBookingDetail(booking_reference);

                await slotRepo.unbookingSeat(previousBooking.appointment_slot_id);
                console.log('unbooked previous slot');

                await slotRepo.bookingSeat(slot_id);
                console.log('booking another appointment slot successful');

                const reschedule = await bookRepo.rescheduleBooking(booking_reference, slot_id);
                 if(!reschedule){
                    throw new Error("Booking could not be created");
                 }

                return {success: true, status : 200, message : "Rescheduled successfully done"}
             }
             catch(err){
                return {success: false, status:409, message : err.message} 
             }

            }, 







        async cancleSlot(){

        }

    }


}




// import { getDb, getClient } from "../../shared/config/db.js";

// export async function bookSlotService() {
//   const db = await getDb();
//   const client = getClient(); // 👈 here’s the MongoClient instance

//   const session = client.startSession();

//   try {
//     await session.withTransaction(async () => {
//       // Example insert
//       await db.collection("bookings").insertOne(
//         { email: "test@test.com" },
//         { session }
//       );

//       // Example update
//       await db.collection("appointment_slots").updateOne(
//         { _id: new ObjectId("68bf0230b4ca5ce97eb3a86b"), booked: { $lt: 10 } },
//         { $inc: { booked: 1 } },
//         { session }
//       );
//     });

//     return { success: true };
//   } catch (err) {
//     throw new Error(`Transaction failed: ${err.message}`);
//   } finally {
//     await session.endSession();
//   }
// }