

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



   

}

