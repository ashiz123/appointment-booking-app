//Slot migration
import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runSlotMigration(db){
    const slotSchema =  { $jsonSchema : {
                    bsonType : "object",
                    title : "Appointment slot validation",
                    required : [ "business_id", "service_id" , "business_start" , "business_end",  "date" , "service_duration" , "seats"],
                    properties : { business_id: { bsonType : "int", description : "business ID"},
                                   service_id : {bsonType : "int",description : "service Id"},
                                   business_start : { bsonType : "string",description : "business start time HH:MM format"},
                                   business_end : { bsonType : "string", description : "business end time in HH:MM format" },
                                   date: {bsonType : "string",  description : "date in YYYY-MM-DD format" },
                                   service_duration : { bsonType : "int", minimum : 1, description : "duration of service in minute" },
                                   seats : { bsonType : "int", minimum : 1, description : "number of seats, must be >=1 " }
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





