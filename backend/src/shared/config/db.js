import { MongoClient } from 'mongodb';
const url = process.env.MONGODB_URI || "mongodb://mongodb:27017";
const dbName = process.env.DB_NAME || "mydb"

let client;
let dbInstance = null;

 
export async function connect(){
    if(dbInstance){
        return dbInstance
    }

    client = new MongoClient(url);

    try{
     await client.connect();
     dbInstance = client.db(dbName)
     console.log('Mongo db connected successfully');
    }catch(err){
      console.error("MongoDB connection failed:", err.message);
      throw err;
    }    

   

    return dbInstance;
}

export function getDb(){
 if(!dbInstance){
    throw new Error('Mongodb not connected. Call connect first');
 }    
 return dbInstance;
}

export function getClient(){
    if(!client){
        throw new Error("Mongo client not instantiated . Call connect() first. ");
    }
    return client;
}




