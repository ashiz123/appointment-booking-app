export function slotFactory(repository){

   return{

     async createSlot({start_time, end_time, durationInMinutes}){
         return start_time;
     },


    async updateSlot(){

    },

    async deleteSlot(){

    }
   }

}