import { bookSlotService } from "./bookSlotService.js";
import { handleError } from "../../shared/utils/errorHandler.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";




//middleware validaion done
export async function booking(req, res, next){
  try{
    const data = req.body;
    const service = await bookSlotService();
    const result = await service.bookSlot(data);
    return responseHandler(res, result);
  }
  catch(err){
 return res.status(400).json({
      source: err.source,  // <-- use the property you set
      message: err.message
    });
    
  }
}


export async function cancle(){
s
}
