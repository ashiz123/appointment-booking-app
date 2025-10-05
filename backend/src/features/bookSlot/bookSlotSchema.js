
import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runBookSlotMigration(db){
    const bookSlotSchema = {
        $jsonSchema : {
            bsonType : "object",
            title : "Booking slot",
            required : ['fullname', 'email', 'phone', 'appointment_slot_id', 'status', 'created_at', 'updated_at'],
            properties : {
                fullname : {bsonType : "string", description : "Full name"},
                email : {bsonType : "string", pattern: "^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$", description: "Email field " },
                phone : {bsonType : "string", pattern : "^[0-9]{10}$"},
                appointment_slot_id : {bsonType : "objectId" , description: "Booking time"},
                booking_reference : {bsonType: "string", description: "Unique booking reference"},
                rescheduled_count : {bsonType : "int" , description: "Number of times the booking has rescheduled"},
                status : {bsonType : "string", enum : ["booked", "completed", "cancelled", "rescheduled"], description: "Status field"},
                created_at : {bsonType: "date"},
                updated_at : {bsonType : "date"}
            }
        }
    }


        const collectionOptions = {
             validator : bookSlotSchema,
             validationLevel : "strict",
             validationAction : "error"
        }  


    const collectionName = "booking_slot";
    await createUpdateSchema(db, collectionName, collectionOptions);   

}