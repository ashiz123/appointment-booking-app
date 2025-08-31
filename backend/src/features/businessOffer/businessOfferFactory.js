


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
                price : price,
                durationMinute: duration,
                businessId: businessId,
                category : category ?? null,
                created_at : new Date(),
                updated_at : new Date()
            }
            const insertedId = await repository.create(offerData);
            return insertedId;
        },

        async updateService(id, updates){

        },


        async deleteService(id){

        },

        async getServiceById(id){

        }


    }




}