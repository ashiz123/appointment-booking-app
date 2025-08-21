
export function businessFactory(repository){

 return {
    async createBuisness({name, email, address}){
          if(!name || !email){
                throw new Error('Name and email are required');
            }
            const exists = await repository.existingBusinessNameWithEmail(name, email);
            if(exists){
                throw new Error('Business already exist');
            }
        
            const businessDetail = {
                name : name,
                address : address,
                email: email
            };

            const insertedId = await repository.createBusinessRepository(businessDetail)
            return insertedId;
        },



    async deleteBusiness(id){
        if(!id){
           return { success: false, message: "Business id is required" };
        }

        const result = await repository.deleteBusinessRepository(id);

        if(result.deletedCount == 0){
            return {success: false, message: "No business found"};
        }

        return { success: true , business_id: id };
    }    
 }

}