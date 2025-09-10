import { businessService } from "./buinessService.js";
import { handleError } from "../../shared/utils/errorHandler.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";
import { BusinessRepository } from "./businessRepository.js";


export async function createBusiness(req, res, next){
try{
         const userId = req.user.id
        
         const service = await businessService();
         const result = await service.createBuisness(req.body, userId);
         return res.status(201).json({
            message : "Business created successfully",
            business_id : result
         });
    }
    catch(err){
        console.log(err);
        return handleError(res, err);
        //  next(err)
    }
   

}


export async function deleteBusiness(req, res){
    try{
        const id = req.params.id;
        const service = await businessService();
        const result = await service.deleteBusiness(id);
        return responseHandler(res, result);

       
    }
    catch(err){
       return handleError(res, err);
    }
}


export async function updateBusiness(req, res){

   try{
        const id = req.params.id;
        const updateData = req.body;
        const service = await businessService();
        const result = await service.updateBusiness(id, updateData);
        console.log(result);
        return responseHandler(res, result);
   }
   catch(err){
        return handleError(res,err);
    }

}


export async function getBusinessByUser(req, res){
    try{
         const authId = req.user.id;
         const service = await businessService();
         const result = await service.getBusinessByUser(authId);
         console.log(result);
         return responseHandler(res, result);
        }
    catch(err){
        return handleError(res,err);
    }
}