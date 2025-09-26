

export function bookSlotPipeline(matchFilter){
    return [

        {
            $match : matchFilter
        },
        
        {
            $lookup : {
                from : "appointment_slots",
                localField : "appointment_slot_id",
                foreignField : "_id",
                as: "appointment_slot_detail"
            }
        },
        {
            $unwind: {
                path : "$appointment_slot_detail",
                preserveNullAndEmptyArrays : true
            }
        },
        {
            $match: {
                "appointment_slot_detail.slot_start" : {$gt : new Date()}
            }
        },
        {
            $project : {
                booking_id : "$_id",
                fullname : 1, 
                email : 1, 
                phone : 1,
                booking_reference : 1,
                appointment_slot_id : 1,
                slot_start : "$appointment_slot_detail.slot_start"
            }
        },
      
        ]
}

// in case need to sort
  // {
        //     $sort : {
        //         $slot_start : 1
        //     }
        // }