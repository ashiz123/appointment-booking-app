import { createBusinessOfferService } from "./businessOfferService.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";


export async function createBusinessOffer(req, res, next){
try {
    const service = await createBusinessOfferService(); 
    const result = await service.addService(req.body);  
    return responseHandler(res, result);   
    } catch (err) {
    console.log(err);
    next(err);
  }
}