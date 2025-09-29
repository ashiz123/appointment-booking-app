import { bookSlotService } from "./bookSlotService.js";
import { handleError } from "../../shared/utils/errorHandler.js";
import { responseHandler } from "../../shared/utils/responseHandler.js";




//middleware validaion done
export async function bookingController(req, res, next){
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

// export async function getBookingDetail(req,res, next){
//   const {email, phone} = req.body;
// }


export async function rescheduleController(req, res, next){
  try{
    const {booking_reference, appointment_slot_id} = req.body;
    const service = await bookSlotService();
    const result = await service.rescheduleAppointment(booking_reference, appointment_slot_id);
    return responseHandler(res, result);
  }
  catch(err){
    return res.status(400).json({
        source: err.source,  // <-- use the property you set
        message: err.message
      });
  }

}


export async function cancleController(){

}
