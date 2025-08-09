import { getDb } from "../config/db.js";

const COLLECTION_NAME = 'users';


export async function findUserByUsername(username){
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({username});
}

export async function saveUser(user){
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(user);
    const userId = result.insertedId;
    return userId;
}