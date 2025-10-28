import { businessOfferService } from "./businessOfferService.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";


export async function createBusinessOffer(req, res, next){
 try {
    const service = await businessOfferService(); 
    const result = await service.addService(req.body);  
    return responseHandler(res, result);   
 } catch (err) {
    next(err);
}}



export async function updateBusinessOffer(req, res, next){
  try{
    const {offerId} = req.params;
    const authId = req.user.id;
    const service = await businessOfferService(); 
    const result = await service.updateOffer(offerId, req.body, authId);  
    return responseHandler(res, result);  

  }
  catch(err){
    next(err);
  }
}



export async function deleteBusinessOffer(req, res, next){
  try{
      const authId = req.user.id;
      const {offerId} = req.params;
      const service = await businessOfferService(); 
      const result = await service.deleteOffer(offerId, authId);  
      return responseHandler(res, result);  
  }
  catch(err){
      next(err);
    }
}



