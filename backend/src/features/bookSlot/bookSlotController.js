import { bookSlotService } from "./bookSlotService.js";
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
    next(err);
  }
}



export async function rescheduleController(req, res, next){
  try{
    const {booking_reference, appointment_slot_id} = req.body;
    const service = await bookSlotService();
    const result = await service.rescheduleAppointment(booking_reference, appointment_slot_id);
    return responseHandler(res, result);
  }
  catch(err){
    next(err);
  }

}


export async function cancelController(req, res , next){
  try{  
     const {email} = req.params;
     const {booking_reference} = req.body;
     const service = await bookSlotService();
     const result = await service.cancelAppointmen(email, booking_reference);
     return responseHandler(res, result);
  }
  catch(err){
    next(err);
  }
}


export async function showBookedAppointment(req, res, next){
  try{
  const {start_date, end_date} = req.query;
  const fromDate = new Date(start_date);
  const toDate = new Date(end_date);
  const service = await bookSlotService();
  const authId =  req.user.id;
  const result = await service.getBookedAppointment(fromDate, toDate, authId);
  return responseHandler(res, result);
  }
  catch(err){
    next(err)
  }
}
