
import { ObjectId } from "mongodb";
import { getOwnershipBusiness } from "../../shared/utils/checkBusinessOwnership.js";

export function businessFactory(repository){

 return {
    async createBuisness({name, email, address, start_time, end_time}, userId){
          if(!name){
                throw new Error('Name and email are required');
            }
            const exists = await repository.existingBusinessNameWithEmail(name, email);
            if(exists){
                throw new Error('Business already exist');
            }

            const businessDetail = {
                name : name,
                owner : new ObjectId(userId),
                address : address,
                start_time: start_time,
                end_time: end_time
            };

            console.log(businessDetail);

            const insertedId = await repository.createBusinessRepository(businessDetail)
            return insertedId;
        },



    async updateBusiness(id, updateData, userId){
        if(!id){
           return { status:400, success: false, message: 'Business Id is required' };
        }
        if(!updateData || Object.keys(updateData).length === 0){
            return { status:400, success: false, message: 'No update data provided' };
        }

        const check = await getOwnershipBusiness(repository, id, userId);
        if(check.error){
             return { status:check.status, success: false, message:check.message};
        }
      
        const result = await repository.updateBusinessRepository(id, updateData);
    
        if(result.matchedCount > 0 && result.modifiedCount === 0){
             return { status:400, success: false, message: 'Business is already updated' };
        }

        return {status:200, success: true, data: id};

     },



    async deleteBusiness(id, userId){
        if(!id){
           return { status:400, success: false, message: "Business id is required" };
        }

         const check = await getOwnershipBusiness(repository, id, userId);

        if(check.error){
             return { status:check.status, success: false, message:check.message};
        }
       
        const result = await repository.deleteBusinessRepository(id , userId);

        if(result.deletedCount == 0){
            return {status:400, success: false, message: "No business found"};
        }

        return {status:200,  success: true , data: id };
    },



     async getBusinessByUser(userId){
    if(!userId){
            return {status : 400, success: false, message: "Auth user is not found"}
        }
        const result = await repository.getBusiness(userId);
        console.log(result);
        return {status: 200, success: true, data: result};
    }


     

}
}


