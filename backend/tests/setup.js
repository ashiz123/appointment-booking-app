import dotenv from "dotenv";
dotenv.config();

import { connect, getClient } from "../src/shared/config/db.js";

beforeAll(async () => {
  try{
    await connect();
  }catch(err){
    console.log('Error setup connection:' , err.message);
  }
});

