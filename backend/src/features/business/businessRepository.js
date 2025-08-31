

import { ObjectId } from "mongodb";

export class BusinessRepository{


    constructor(db){
        this.db = db;
        this.collectionName = 'business';
    }


    async createBusinessRepository(business){
        const result = await this.db.collection(this.collectionName).insrtOne(business);
        const businessId = result.insertedId;
        return businessId;
    }


   async existingBusinessNameWithEmail(name, email){
       return await this.db.collection(this.collectionName).findOne({name, email});
   }


   async  deleteBusinessRepository(id){
        return await this.db.collection(this.collectionName).deleteOne({_id: new ObjectId(id) });
        
   }

   async updateBusinessRepository(id, updateData){
        const result =  await this.db.collection(this.collectionName).updateOne(
            {_id: new ObjectId(id)},
            {$set: updateData}
        );
        return result;
   }

   async getBusiness(userId){
        
   }

}