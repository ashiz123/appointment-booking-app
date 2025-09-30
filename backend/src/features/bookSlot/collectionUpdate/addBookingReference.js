import {v4 as uuidv4} from "uuid";
import { connect } from "../../../shared/config/db.js";

async function addBookingReference(){
    try{
        const db = await connect();

        const bookings = await db.collection("booking_slot").find({booking_reference: {$exists : false}}).toArray();

        for(const booking of bookings){
            await db.collection("booking_slot").updateOne(
                {_id : booking._id},
                {$set : { booking_reference : uuidv4() }}
            )
        }

        console.log('Add booking reference in booking collection successful');
    }

    catch(err){
        console.error("Adding booking reference in booking collection failed", err);
    }
}

addBookingReference();
