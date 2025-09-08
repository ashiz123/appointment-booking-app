
//Business migration with schema validation 

import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runBusinessMigration(db){

    const businessSchema = {
           $jsonSchema: {
            bsonType: "object",
            title: "Business migration",
            required: ['name', 'email', 'address', 'start_time', 'end_time'],
            properties: {
                name: { bsonType: "string", description: "name of the business" },
                email: { bsonType: "string", description: "email for the business" },
                address: { bsonType: "string", description: "address of business" },
                start_time: { bsonType: "string", description: "Business start time" },
                end_time: { bsonType: "string", description: "Business end time" }
            }
        }
    }

    const collectionOptions = {
        validator : businessSchema,
        validationLevel : "strict",
        validationAction : "error"
    }

    const collectionName = "business";
    await createUpdateSchema(db, collectionName, collectionOptions);

}