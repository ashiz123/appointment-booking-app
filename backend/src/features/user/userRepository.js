// import { getDb } from "../../shared/config/db.js";

// const COLLECTION_NAME = 'users';


// export async function findUserByUsername(username){
//     const db = getDb();
//     return await db.collection(COLLECTION_NAME).findOne({username});
// }

// export async function saveUser(user){
//     const db = getDb();
//     const result = await db.collection(COLLECTION_NAME).insertOne(user);
//     const userId = result.insertedId;
//     return userId;
// }

export class UserRepository {

    constructor(db){
        this.db = db;
        this.collection = 'users';
    }

    async  findUserByUsername(username){
       return await this.db.collection(this.collection).findOne({username});    
    }


    async  saveUser(user){
        console.log('user in db', user);
    const result = await this.db.collection(this.collection).insertOne(user);
    const userId = result.insertedId;
    return userId;
    }  



    
}