 
import { getSlotsByDatePipeline } from "./pipelines/slotPipeline.js";
import { getLogger } from "../../shared/utils/logger.js";
import { ObjectId } from "mongodb";
const logger = getLogger();

 export class SlotRepository{

    constructor(db){
        this.db = db;
        this.collectionName = "appointment_slots";
    }

  async createSlot(slot_start, slot_end, businessId, serviceId, seats){

        if (!slot_start || !slot_end) throw new Error("Slot start and end required");
         if(!seats || seats < 1) throw new Error("Seats is required and must me atleast 1")

        const slotDoc = {
            business_id : businessId,
            service_id : serviceId,
            slot_start : new Date(slot_start),
            slot_end : new Date(slot_end),
            status : "available",
            booked : 0,
            total_seats : seats 
        }

        console.log(slotDoc);

        const result = await this.db.collection(this.collectionName).insertOne(slotDoc);
        return result;
    } 


    async fetchSeatsBySlotId(slot_id){
         const slot = await this.db.collection(this.collectionName).findOne({ _id: slot_id });
         return slot
    }
    
  



    async bookingSeat(slot_id){
        try {
            const slot = await this.db.collection("appointment_slots").findOne({ _id: slot_id });
            if (!slot) throw new Error("Slot not found");

           const result = await this.db.collection(this.collectionName).updateOne(
                { _id: slot_id, booked: { $lt: slot.total_seats } },
                { $inc: { booked: 1 }, $set: { updated_at: new Date() } }
            );
            if (result.matchedCount === 0 || result.modifiedCount === 0) {
                throw new Error("Failed to book seat");
            }

            return result;
        } catch (err) {
            logger.error(`Book seat failed for slot_id ${slot_id}: ${err.message}`);
            throw err;
        }
    }


    async unbookingSeat(slotId){
        try{
            const result = await this.db.collection(this.collectionName).updateOne(
                {_id : slotId, booked : {$gt : 0}},
                {$set : {updated_at : new Date()} , $inc : {booked: -1}}
            
            )

            if (result.matchedCount === 0 || result.modifiedCount === 0) {
                    throw new Error("Failed to unbook seat");
            }

            return result;
        }
        catch(err){
            throw new Error(`Unbook seat failed : ${err.message}`)
        }


    }


    
     async  showSlotByDate(day, nextDay){
        if(!day) throw new Error('Date is required');
        const pipeline = await getSlotsByDatePipeline(day, nextDay);
        const results = await this.db.collection(this.collectionName).aggregate(pipeline).toArray();
        return results;
    }


    //Valid date is greater than current date
    async isDateValid(slot_id){
        const result = await this.db.collection(this.collectionName).findOne({ _id: slot_id });
        if (!result) throw new Error("No document found");
        if (!(result.slot_start instanceof Date)) throw new Error("Invalid slot_start value");
        return result.slot_start > new Date();
    }
        

}

