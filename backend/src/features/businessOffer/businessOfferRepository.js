
import { getDb } from "../../shared/config/db.js";


export class BusinessOfferRepository{

 async init() {
    this.db = await getDb(); 
    this.collectionName = 'business_offer';
    return this; 
  }


   async create(businessOffer){
      const  result = await this.db.collection(this.collectionName).insertOne(businessOffer);
      const businessOfferId = result.insertedId;
      return businessOfferId;
    }

    async getById(id){

    }

    async update(id, updates){

    }

}

