

import { ObjectId } from "mongodb";
import { buildBooking } from "./bookingSlotModel.js";




export function bookSlotFactory(bookRepo, slotRepo){

    return {


            async bookSlot({appointment_slot_id, fullname, email, phone}){
          

             const slot_id = new ObjectId(appointment_slot_id);
             const slotBooked = await bookRepo.slotAlreadyBooked(slot_id, email);
             let result;
             
             if (slotBooked) {
                return { success: false, status: 400, message: "Booking already exists for this user" };
             }

             try{
                const bookingResult = await bookRepo.bookingSlot(
                       buildBooking(slot_id, fullname, email, phone)
                 );

                 if(!bookingResult.acknowledged){
                    throw new Error("Booking could not be created").status
                 }

                 const updateBookResult = await slotRepo.updateBookedSeats(slot_id);


                if(updateBookResult.acknowledged && updateBookResult.modifiedCount > 0){
                    result = {success:true, status:200, message : "Slot booked successfully"}
                }
                else
                {
                   await bookRepo.cancleBookedSlot(bookingResult.insertedId);
                   result = {success : false,  status: 400, message: "Problem occured with appointment_slot update"};
                }

                return result;
            }
             catch(err){
                if(bookingResult?.insertedId){
                    bookRepo.cancleBookedSlot(bookingResult.insertedId);
                }
                throw new Error(`Error occured : ${err.message}`);
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