
//Business migration with schema validation 

import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runBusinessMigration(db){

    const businessSchema = {
           $jsonSchema: {
            bsonType: "object",
            title: "business schema",
            required: ['name', 'owner', 'address', 'start_time', 'end_time'],
            properties: {
                name: { bsonType: "string", description: "name of the business" },
                owner: {bsonType: "objectId", description: "Must be user_id(objectId)" },
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