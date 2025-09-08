

export async function createUpdateSchema(db, collectionName, options){
    const collectionListToArray = await db.listCollections({name: collectionName}).toArray();
    console.log(collectionListToArray);
    if(collectionListToArray.length === 0){
        await db.createCollection(collectionName, options);
        console.log(`${collectionName} collection created successfully`);
      }else{
        await db.command({collMod:collectionName, ...options});
        console.log(`${collectionName} collection already exist. Schema updated`);
    }

}