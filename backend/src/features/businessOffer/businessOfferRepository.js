

import { ObjectId } from "mongodb";


export class BusinessOfferRepository{

constructor(db){
    this.db = db;
    this.collectionName = 'business_offer';
  }


   async create(businessOffer){
      const  result = await this.db.collection(this.collectionName).insertOne(businessOffer);
      const businessOfferId = result.insertedId;
      return businessOfferId;
    }

    async update(id, data){
     try{
       const result = await this.db.collection(this.collectionName).updateOne(
        {_id : new ObjectId(id)},
        {$set : data}
      );
      return result;
     }catch(err){
      throw new Error('databaseError');
     }
    }


    async delete(id){
      try{
        const result = await this.db.collection(this.collectionName).deleteOne({_id : new ObjectId(id)});
        return result;
      }
      catch(err){
        throw new Error('databaseError');
      }
    }



    async getBusinessDetail(businessId, serviceId){
      const service = await this.db.collection(this.collectionName).findOne({
          _id : new ObjectId(serviceId),
           businessId : new ObjectId(businessId)
        });

      if(!service){
        throw new Error("Service not belong to current business");
      }

      return service;
      
    }


    async getBusinessId(businessOfferId){
      try{
        const businessOffer = await this.db.collection(this.collectionName).findOne({_id : new ObjectId(businessOfferId)}, {projection : {businessId:1}});
        return businessOffer;
      }
      catch(err){
        throw new Error('databaseError')
      }
    }

}

