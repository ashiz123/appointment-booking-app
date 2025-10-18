import { slotService } from "./slotService.js";
import { minutesToDate, timeToMinute } from "../../shared/utils/dateTimeCovert.js";
import { getLogger } from "../../shared/utils/logger.js";
const logger = getLogger();



export async function createSlot(req, res, _next){

    //validation - express-validator in route
    const {business_id , service_id, business_start, business_end, service_duration, date, seats} = req.body;
    const authId = req.user.id;
    const slots = [];
    const start = timeToMinute(business_start);
    const end = timeToMinute(business_end);
    const serviceDuration = service_duration;

    for(let current = start; current + serviceDuration <= end; current += serviceDuration){
 
       
        const service = await slotService();
        const slotStart = minutesToDate(date, current);
        const slotEndMinute =  current + serviceDuration;
        const slotEnd = minutesToDate(date, slotEndMinute) ;

        try{
           const generateSlot = await service.createSlot(authId, slotStart, slotEnd, business_id, service_id, seats);
           slots.push({
                slotStart,
                slotEnd,
                success: generateSlot.success,
                error: generateSlot.success ? null : "Slot not created"
            });
        }
        catch(err){
            // console.error(err.errInfo.details.schemaRulesNotSatisfied);
            return res.status(500).json({
                message : err.message
            })
            // next(err);  custom middleware for error handling is not working
        }
    }


    return res.status(200).json({
        slots
    });
 }


export async function getSlotsByDate(req, res, _next){
  try{
    const filterDay = new Date(req.body.date);       
    const tomorrow = new Date(filterDay);        
    tomorrow.setDate(filterDay.getDate() + 1); 
    
    const service = await slotService();
    const data = await service.showSlotByDate(filterDay, tomorrow);
    logger.info(data);

    return res.status(200).json({data}); 
  }
  catch(err){
    return res.status(500).json(err.message);
  }
}






