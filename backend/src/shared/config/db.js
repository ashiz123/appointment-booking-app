import { MongoClient } from 'mongodb';

let client;
let dbInstance = null;

 
export async function connect(){
    if(dbInstance){
        return dbInstance
    }

    const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    const dbName = process.env.DB_NAME || (process.env.NODE_ENV === 'test' ? 'testdb' : 'testdb' );
    console.log(url)

    client = new MongoClient(url);

    try{
     await client.connect();
     dbInstance = client.db(dbName)
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


export async function closeConnection(){
    if(client && client.topology?.isConnected()){   
        await client.close();
    }
}
