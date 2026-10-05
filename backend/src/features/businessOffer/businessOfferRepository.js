import { ObjectId } from 'mongodb';
import { AppError } from '../../shared/utils/appError.js';

export class BusinessOfferRepository {
  constructor(db) {
    this.db = db;
    this.collectionName = 'business_offer';
  }

  async create(businessOffer) {
    try {
      const result = await this.db
        .collection(this.collectionName)
        .insertOne(businessOffer);
      const businessOfferId = result.insertedId;
      return businessOfferId;
    } catch (error) {
      console.log(error.message);
      throw new AppError('databaseError', [
        { message: 'Database error found to create business offer' },
      ]);
    }
  }

  async update(id, data) {
    try {
      const result = await this.db
        .collection(this.collectionName)
        .updateOne({ _id: new ObjectId(String(id)) }, { $set: data });
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('databaseError');
    }
  }

  async delete(id) {
    try {
      const result = await this.db
        .collection(this.collectionName)
        .deleteOne({ _id: new ObjectId(String(id)) });
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('databaseError');
    }
  }

  async getBusinessDetail(businessId, serviceId) {
    const service = await this.db.collection(this.collectionName).findOne({
      _id: new ObjectId(String(serviceId)),
      businessId: new ObjectId(String(businessId)),
    });

    if (!service) {
      throw new Error('Service not belong to current business');
    }

    return service;
  }

  async getBusinessId(businessOfferId) {
    try {
      const businessOffer = await this.db
        .collection(this.collectionName)
        .findOne(
          { _id: new ObjectId(String(businessOfferId)) },
          { projection: { businessId: 1 } }
        );
      return businessOffer;
    } catch (err) {
      console.log(err);
      throw new Error('databaseError');
    }
  }
}
