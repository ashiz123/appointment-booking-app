


export function slotFactory(slotRepository, businessRepo, businessOfferRepo){

   return{

     async createSlot(authId, start_time, end_time, businessId, serviceId, seats) {
      try{

      //check if the business of authenticated user 
      await businessRepo.getBusinessByAuthUser(businessId, authId);
     //check if the service of current passed business
      await businessOfferRepo.getBusinessDetail(businessId, serviceId);

      const slot = await slotRepository.createSlot(start_time, end_time, businessId, serviceId, seats);
      return slot.acknowledged ? { success: true, insertedId: slot.insertedId } : { success: false };
      }

      catch(err){
        if(err.code === 11000){
          throw new Error('Duplicate slot create in the same date is not acceptable');
        }else{
          throw new Error(`The given data cannot create the appointment slot : ${err}`)
        }
          
      }

     },

    async updateSlot(){
      const slot = await slotRepository.updateSlot();
      return slot.acknowledged ? { success: true } : { success: false };

    },

    async showSlotByDate(day, nextDay){
      const slot = await slotRepository.showSlotByDate(day , nextDay);
      return slot;
    },

    

    async deleteSlot(){
      
    }


    
   }

}

