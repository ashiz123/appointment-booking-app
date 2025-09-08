//Slot migration
import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runSlotMigration(db){
    const slotSchema =  { $jsonSchema : {
                    bsonType : "object",
                    title : "Appointment slot validation",
                    required : [ "business_id", "service_id" , "slot_start" , "slot_end",  "status" , "booked" , "total_seats"],
                    properties : { business_id: { bsonType : "number", description : "business ID" , minimum: 1},
                                   service_id : {bsonType : "number",description : "service Id", minimum:1},
                                   slot_start : { bsonType : "date", description : "business start time "},
                                   slot_end : { bsonType : "date", description : "business end time" },
                                   status: {bsonType : "string", enum: ["available", "booked", "unavailable"]},
                                   booked : { bsonType : "number", minimum : 0, description : "duration of service in minute" },
                                   total_seats : { bsonType : "number", minimum : 1, description : "number of seats, must be >=1 " }
                     } 
                }   

            }

        const collectionOptions = {
             validator : slotSchema,
             validationLevel : "strict",
             validationAction : "error"
        }    

        const collectionName = "appointment_slots";
        await createUpdateSchema(db, collectionName, collectionOptions);
        
    }





