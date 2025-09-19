
/**
 * 
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Array<Object>}
 */


export  function getSlotsByDatePipeline(start, end){
return [
    {$match : {slot_start : {$gte : start , $lt: end}}},
    {$project : {slot_start : 1, booked : 1, total_seats : 1, _id: 0}} 
 ]
}

 