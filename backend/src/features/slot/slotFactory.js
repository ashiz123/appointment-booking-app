


export function slotFactory(repository){

   return{

     async createSlot(start_time, end_time, businessId, serviceId, seats) {
        const slot = await repository.createSlot(start_time, end_time, businessId, serviceId, seats);
        return slot.acknowledged ? { success: true, insertedId: slot.insertedId } : { success: false };
     },

    async updateSlot(){
      const slot = await repository.updateSlot();
      return slot.acknowledged ? { success: true } : { success: false };

    },

    async showSlotByDate(day, nextDay){
      const slot = await repository.showSlotByDate(day , nextDay);
      return slot;
    },

    async deleteSlot(){
      
    }
   }

}

