import { businessService } from "./buinessService.js";


export async function createBusiness(req, res){
    try{
         const service = await businessService();
         const result = await service.createBuisness(req.body);
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


export async function deleteBusiness(req, res){
    try{
        const id = req.params.id;
        const service = await businessService();
        const result = await service.deleteBusiness(id);

        if(result.success){
            return res.status(200).json(result);
        }else{
            return res.status(404).json(result);
        }

       
    }
    catch(err){
        console.log('Error deleting business', err);
        return res.status(500).json({
            message : "Internal server error",
            error : err.message,
            success: false
        })
    }
}


// export async function updateBusiness(){

//     try{
//         const result = await updateBusinessService()

//     }
//     catch(err){
//         console.log('Cannot update business', err);
//         return res.status(200).json({
//             message: "Internal server error",
//             error: err.message
//         })
//     }

// }