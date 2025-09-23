

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


    async bookingSlot(bookingDetail){
      try{
     
        const result = await this.db.collection(this.collectionName).insertOne(bookingDetail);
        console.log('booking_slot', result);
        return result;
      }
      catch(err){
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


}