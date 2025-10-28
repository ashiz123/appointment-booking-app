import {connect, closeConnection, getDb} from '../../src/shared/config/db.js';



//testing the connection before all tests
beforeAll(async () => {
  try{
    if(!global.db)
    {
        await connect();
        global.db = await getDb();
    }   
  }
    catch(err){ 
        console.error("Error connecting to the database in tests setup:", err);
        throw err;
    }
});





//closing the connection after all tests
afterAll(async () => {
    await closeConnection();
    global.db = null
});


