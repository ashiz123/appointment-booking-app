import { getLogger } from "../../shared/utils/logger.js"

const logger = getLogger();

export function slotFactory(repository){

   return{

     async createSlot(start_time, end_time, businessId, serviceId, seats) {
        const slot = await repository.createSlot(start_time, end_time, businessId, serviceId, seats);
   
        if (slot.acknowledged) {
        return {
            success: true,
            insertedId: slot.insertedId
          };
        } else {
          return { success: false, message: "Failed to insert slot" };
        }
     
    },

    async updateSlot(){

    },

    async deleteSlot(){

    }
   }

}

