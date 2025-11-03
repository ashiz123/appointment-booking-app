import {ObjectId} from 'mongodb'
import { AppError } from '../../shared/utils/appError.js';


export function BusinessOfferFactory(businessOfferRepo, businessRepo){


    return{
        async addService({name, description, price,duration, businessId}){
         
            if (!name) throw new AppError('validationError', [{message : "Name is required"}]);
             if (!price) throw new AppError('validationError', [{message : "Price is required"}]);
            if(!duration) throw new Error("Duration is required");
            if (!businessId) throw new Error("Business ID is required");

            const offerData = {
                name : name,
                description : description, 
                businessId: new ObjectId(businessId),
                price : price,
                duration: duration,
                created_at : new Date(),
                updated_at : new Date()
            }

            
            const businessOfferId = await businessOfferRepo.create(offerData);
            return {
            status: 200,    
            success: true,
            data: businessOfferId,
            message : 'Business offer created successfully'
           };
        },


    
         async updateOffer(businessOfferId, updatedData, authId){


            const businessOffer = await businessOfferRepo.getBusinessId(businessOfferId);
           
            if(!businessOffer){
                throw new AppError('resourceDoesNotExist', [{ type : "field",path : "businessOfferRepository", msg: "Business offer not found"}] );
            }

            if(!updatedData || Object.keys(updatedData).length === 0){
                throw new AppError('resourceDoesNotExist', [{ type : "field", path : "businessOfferRepository", msg: "No any data provided"}] );
            }

            
             await businessRepo.getBusinessByAuthUser(businessOffer.businessId, authId);

             const result = await businessOfferRepo.update(businessOfferId, updatedData);
             if(result.matchedCount > 0 && result.modifiedCount === 0){
                throw new Error('conflictError');
                }
            return {status : 200 , success: true, message : "Business offer updated successfully"};
        },



       async deleteOffer(businessOfferId, authId){
            const businessOffer = await businessOfferRepo.getBusinessId(businessOfferId);
            
            if(! businessOffer.businessId){
                 throw new AppError('resourceDoesNotExist', [{ type : "field",path : "businessOfferRepository", msg: "Business not found"}] );
            }
            await businessRepo.getBusinessByAuthUser( businessOffer.businessId, authId);
            
            const result = await businessOfferRepo.delete(businessOfferId);
            if(result.deletedCount === 1){
                return {status : 200 , success: true, message : "Business offer deleted successfully"};
            }else{
                throw new Error('conflictError');
            }
        }

    }}


   




