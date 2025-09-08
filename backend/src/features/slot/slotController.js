import { slotService } from "./slotService.js";
import { getLogger } from "../../shared/utils/logger.js";
import { minutesToDate, timeToMinute } from "../../shared/utils/dateTimeCovert.js";

// const logger = getLogger();



export async function createSlot(req, res, next){

    //validation - express-validator in route
    const {business_id , service_id, business_start, business_end, service_duration, date, seats} = req.body;
   
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
           const generateSlot = await service.createSlot(slotStart, slotEnd, business_id, service_id, seats);
           slots.push({
                slotStart,
                slotEnd,
                success: generateSlot.success,
                error: generateSlot.success ? null : "Slot not created"
            });
        }
        catch(err){
            console.log('Failed to create slot', err.message);
            return res.status(500).json({
                message : err.message
            })
            // next(err);  custom middleware for error handling is not working
        }
    }


    return res.status(200).json({
        slots
    });




    // const service = await slotService();
    // const temp_business_id = '68a86562344fe183e9fa0587'
    // const generateSlot = await service.createSlot()
    
}