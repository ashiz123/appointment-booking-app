

export function bookedAppointmentPipeline(startDate, endDate, ownerId){

    console.log('pipeline', ownerId);

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);


    return [
      

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
            $match : {"appointment_slot_detail.slot_start" : {$gte: startOfDay}, "appointment_slot_detail.slot_end" : {$lte : endOfDay}}
        },


        {
            $lookup : {
                from : "business_offer",
                localField : "appointment_slot_detail.service_id",
                foreignField : "_id",
                as : "business_offer_detail"
            }
        },
        {
            $unwind : {
                path : "$business_offer_detail",
                preserveNullAndEmptyArrays : true
            }
        },

        {
            $lookup : {
                from : "business",
                localField : "appointment_slot_detail.business_id",
                foreignField : "_id",
                as : "business_detail"
            }
        },
        {
            $unwind : {
                path : "$business_detail",
                preserveNullAndEmptyArrays : true
            }
        },

         {
            $match : {"business_detail.owner" : ownerId}
        },

        {
            $project : {
                booking_id : "$_id",
                fullname : 1, 
                email : 1, 
                phone : 1,
                booking_reference : 1,
                appointment_slot_id : 1,
                booking_date_and_time : "$appointment_slot_detail.slot_start",
                total_seats : "$appointment_slot_detail.total_seats",
                service_name : "$business_offer_detail.name",
                // owner_id : "$business_detail.owner"
            }
        }
    ]

}