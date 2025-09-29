

import { ObjectId } from "mongodb";
import { buildBooking } from "./bookingSlotModel.js";
import { sendAppointmentEmail } from "../../shared/config/mailer.js"; 




export function bookSlotFactory(bookRepo, slotRepo){

    return {


            async bookSlot({appointment_slot_id, fullname, email, phone}){
          
             let result;
             let bookedSeat;
             const slot_id = new ObjectId(appointment_slot_id);
             const isValidDateToBook = await slotRepo.isDateValid(slot_id);     //check the valid date to book. Is it greater than current date and time


            if(!isValidDateToBook){
                return {success: false, status: 400, message: "Date must be greater than current date and time"};
            }

         try{

               bookedSeat = await slotRepo.bookingSeat(slot_id); 
              
               if(bookedSeat.acknowledged && bookedSeat.modifiedCount > 0){
                  const bookingResult = await bookRepo.bookingSlot(
                       buildBooking(slot_id, fullname, email, phone)
                 );
                 
                 await sendAppointmentEmail(email, fullname, bookingResult.slot_start, bookingResult.booking_reference, text);
                 result = {success:true, status:200, message : "Slot booked successfully"};
               }else{
                  throw new Error("Issue with the appointment slot booking");
               }

                return result;
            }
             catch(err){
               if(bookedSeat.acknowledged && bookedSeat.modifiedCount > 0){
                    const canceled = await slotRepo.unbookingSeat(slot_id);
                    if(canceled.modifiedCount === 1 ){
                     console.log("Unbook the appointment slot collection, Rolling back");
                    }
                }

                return {success: false, status:409, message : err.message}
             }
            },
                   
                
         
            async rescheduleAppointment(booking_reference, appointment_slot_id){

             const slot_id = new ObjectId(appointment_slot_id);
             const isValidDateToBook = await slotRepo.isDateValid(slot_id);     //check the valid date to book. Is it greater than current date and time


            if(!isValidDateToBook){
                return {success: false, status: 400, message: "Date must be greater than current date and time"};
            }

             try{
                const previousBooking = await bookRepo.fetchBookingDetail(booking_reference);

                await slotRepo.unbookingSeat(previousBooking.appointment_slot_id);
                console.log('unbooked previous slot');

                await slotRepo.bookingSeat(slot_id);
                console.log('booking another appointment slot successful');

                const reschedule = await bookRepo.rescheduleBooking(booking_reference, slot_id);
                
                 if(!reschedule){
                    await slotRepo.unbookingSeat(slot_id);
                    await slotRepo.bookingSeat(previousBooking.appointment_slot_id);
                    throw new Error("Booking could not be created");
                 }

                const text = "Your appointment is rescheduled ";
                await sendAppointmentEmail(reschedule.email, reschedule.fullname, reschedule.slot_start, reschedule.booking_reference, text);
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