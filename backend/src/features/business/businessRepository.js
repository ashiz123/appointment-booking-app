import { getDb } from "../../shared/config/db.js";
const COLLECTION_NAME = 'business';


export async function existingBusinessNameWithEmail(name, email){
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({name, email});
}


export async function createBusinessRepo(business){
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(business);
    const businessId = result.insertedId;
    return businessId;
}

export async function deleteBusinessRepo(business){
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({name: business.name});

    if(result.deletedCount === 0){
        throw new Error(`No business found with name: ${business.name}`)
    }
    return result;
}