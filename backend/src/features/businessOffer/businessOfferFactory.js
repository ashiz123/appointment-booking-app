import {ObjectId} from 'mongodb'


export function BusinessOfferFactory(repository){


    return{
        async addService({name, description, price,duration, businessId, category}){
            if (!name) throw new Error("Name is required");
            if (price == null) throw new Error("Price is required");
            if(!duration) throw new Error("Duration is required");
            if (!businessId) throw new Error("Business ID is required");

            const offerData = {
                name : name,
                description : description,
                businessId: new ObjectId(businessId),
                price : price,
                duration: duration,
                // category : category ?? null,
                created_at : new Date(),
                updated_at : new Date()
            }

            
            const businessOfferId = await repository.create(offerData);
            return {
            status: 200,    
            success: true,
            data: businessOfferId
           };
        },

        async updateService(id, updates){

        },


        async deleteService(id){

        },

        async getServiceById(id){

        }


    }




}