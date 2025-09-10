

import { createUpdateSchema } from "../../shared/utils/createUpdateSchema.js";

export async function runBusinessOfferSchema(db){


    const businessOfferSchema = {
        $jsonSchema :  {
            bsonType : "object",
            title : "Business offer schema",
            required : ['name', 'businessId', 'price', 'duration', 'created_at', 'updated_at'],
            properties : {
                name : {bsonType: "string", description : "Service name"},
                description : {bsonType: "string", description: "Service description"},
                businessId : {bsonType: "objectId", description: "Business id"},
                price : {bsonType: "number", minimum:1, description: "Service price"},
                duration : {bsonType: "number", minimum:1, description: "Service duration"},
                created_at : {bsonType: "date", description: "Service created"},
                updated_at : {bsonType: "date", description: "Service updated"}
            }
        }
    }

    const options = {
        validator : businessOfferSchema,
        validationLevel : "strict",
        validationAction : "error"
    }


    const collectionName = 'business_offer';


    await createUpdateSchema(db, collectionName,options);



}


//db.getCollectionInfos({name: "business_offer"})