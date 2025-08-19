import { createBusinessService } from "./buinessService.js";


export async function createBusiness(req, res){
    try{
         const result = await createBusinessService(req.body);
         return res.status(201).json({
            message : "Business created successfully",
            data: result
         });
    }
    catch(err){
        console.log('Error creating business', err);
        return res.status(500).json({message: "Internal server error",
           error: err.message
        });
    }
   

}


// export async function updateBusiness(){

// }