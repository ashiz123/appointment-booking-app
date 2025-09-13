


export function slotFactory(repository){

   return{

     async createSlot(start_time, end_time, businessId, serviceId, seats) {
        const slot = await repository.createSlot(start_time, end_time, businessId, serviceId, seats);
        return slot.acknowledged ? { success: true, insertedId: slot.insertedId } : { success: false };
     },

    async updateSlot(){

    },

    async deleteSlot(){

    }
   }

}

