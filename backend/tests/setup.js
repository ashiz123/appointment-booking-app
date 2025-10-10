import {connect, closeConnection, getDb} from '../src/shared/config/db.js';



//testing the connection before all tests
beforeAll(async () => {
  try{
    console.log('Setting up database connection before tests');
    if(!global.db)
    {
        await connect();
        global.db = getDb();
    }   
    console.log('Connected tested successfully to the database');
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
    console.log('Database connection closed after tests');
});


