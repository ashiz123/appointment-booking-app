import { connect } from "./db.js";
import { runSlotMigration } from "../../features/slot/slotSchema.js";
import { runBookSlotMigration } from "../../features/bookSlot/bookSlotSchema.js";
import { runBusinessMigration } from "../../features/business/businessSchema.js";
import { runCreateUserSchema } from "../../features/user/userSchema.js";
import { runBusinessOfferSchema } from "../../features/businessOffer/businessOfferSchema.js";

async function migrate(){
    try{
        const db = await connect();
        // await runCreateUserSchema(db);
        // await runBusinessMigration(db);
        // await runBusinessOfferSchema(db);
        // await runSlotMigration(db);
        await runBookSlotMigration(db);
        
        console.log('Migration completed');
    }
    catch(err){
        console.error('Migration failed. Issue found', err.message);
    }
    }

 migrate();


 //to run in docker
//  docker exec -it <container name> node <file path inside that container>