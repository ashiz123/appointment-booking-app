import { bookSlotPipeline } from "./pipelines/bookingSlotPipeline.js";
import { ObjectId } from "mongodb";

export class BookSlotRepository {

    constructor(db){
        this.db = db;
        this.collectionName = "booking_slot"
    }

    async slotAlreadyBooked(slot_id, email){
          try{
            console.log(slot_id, email)
            const result = await this.db.collection(this.collectionName).findOne({appointment_slot_id: slot_id, email});
            return !!result;
          }
          catch(err){
            err.source = "Database error";
            throw err;
          }
        }

  
   async bookingSlot(bookingDetail) {
      try {
        const result = await this.db.collection(this.collectionName).insertOne(bookingDetail);

        if (!result.acknowledged) {
          throw new Error("Booking insert failed");
        }
       const matchFilter = {_id : new ObjectId(result.insertedId) };
       return await this.fetchBookingById(matchFilter)

      } catch (err) {
        throw new Error(`Failed to book slot: ${err.message}`);
      }
    }

   async cancleBookedSlot(bookingId){
       try{
        const result = await this.db.collection(this.collectionName).deleteOne({_id: bookingId});
        console.log('Booked appointment successfully canceled');
        return result;
       }catch(err){
         throw new Error('Error occured while deleting the record');
       }
    }

  



    async rescheduleBooking(booking_reference, slot_id){
     try{
       const result = await this.db.collection(this.collectionName).updateOne({
        booking_reference},  {$set : {appointment_slot_id : slot_id }}, {$inc : {rescheduled_count : 1}});

      if(result.matchedCount === 0){
        throw new Error("Booking not found");
      }

      if(result.modifiedCount === 0){
        throw new Error("Booking update failed")
      }

      const matchFilter = { booking_reference : booking_reference};
      return await this.fetchBookingById(matchFilter)
    
     }
     catch(error){
       throw new Error(`Failed to reschedule booking: ${error.message}`);
     }


    }


    async fetchBookingById(matchFilter){
       const pipeline = bookSlotPipeline(matchFilter);
        const response = await this.db.collection(this.collectionName).aggregate(pipeline).toArray();

        if (!response[0]) {
          throw new Error("Failed to fetch newly inserted booking");
        }
        return response[0];
    }



      async fetchBookingDetail(booking_reference){
      try{
        const result = await this.db.collection(this.collectionName).findOne({booking_reference});
        if(!result) throw new Error("Booking not found");
        return result;
      }
      catch(err){
        throw new Error(`Fetch booking detail with booking reference not found : ${err}`);
      } 
    }


   


}