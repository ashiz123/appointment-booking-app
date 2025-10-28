
import { ObjectId } from "mongodb";
import { AppError } from "../../shared/utils/appError.js";

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
            owner: new ObjectId(authId)
         });
         if(!result){
            throw new AppError("permissionDenied", [{type : "authorization", path: "businessRepository", msg: "Business offer is not of authenticated user"}]);
         }
         
         return result;
   }



 


 

}