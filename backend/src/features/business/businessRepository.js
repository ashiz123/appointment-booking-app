
import { ObjectId } from "mongodb";

export class BusinessRepository{


    constructor(db){
        this.db = db;
        this.collectionName = 'business';
    }


    async createBusinessRepository(business){
        const result = await this.db.collection(this.collectionName).insertOne(business);
        const businessId = result.insertedId;
        return businessId;
    }


   async existingBusinessNameWithEmail(name){
       return await this.db.collection(this.collectionName).findOne({name});
   }


   async  deleteBusinessRepository(businessId){
      return await this.db.collection(this.collectionName).deleteOne({_id: new ObjectId(businessId) });
        
   }

   async updateBusinessRepository(id, updateData){
        const result =  await this.db.collection(this.collectionName).updateOne(
            {_id: new ObjectId(id)},
            {$set: updateData}
        );
        return result;
   }

   async getBusinessById(businessId){
        const result = await this.db.collection(this.collectionName).findOne({_id : new ObjectId(businessId)});
        return result;
   }

  async getBusinessByAuthUser(businessId , authId){
         const result = await this.db.collection(this.collectionName).findOne({
            _id : new ObjectId(businessId),
            ownerId: new ObjectId(authId)
         });

         

         if(!result){
            throw new Error("Business is not belong to authenticated user");
         }
         
         return result;
   }


 

}