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

        
        const result = await this.db.collection(this.collectionName).insertOne(slotDoc);
        return result;
    } 
    
    async updateSlotStatus(){
    
    }

}

