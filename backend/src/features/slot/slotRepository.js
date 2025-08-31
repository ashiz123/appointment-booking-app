 export class SlotRepository{

    constructor(db){
        this.db = db;
        this.collectionName = "slots";
    }

    async createSlot({slot_start, slot_end, capacity, available, status}){
        const slotDoc = {
            slot_start : new Date(slot_start),
            slot_end : new Date(slot_end),
            status,
            available,
            capacity
        }
        const result = await this.db.collection(this.collectionName).insertOne(slotDoc);
        return result;
    }   

}