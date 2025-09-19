import { getDb } from "../../shared/config/db.js";
import {BookSlotRepository} from './bookSlotRepository.js';
import { bookSlotFactory } from './bookSlotFactory.js';
import { SlotRepository } from "../slot/slotRepository.js";

export async function bookSlotService(){
    const db = await getDb();
    const bookRepo = new BookSlotRepository(db); //created instance 
    const slotRepo = new SlotRepository(db);
    return bookSlotFactory(bookRepo, slotRepo); //instance passed to this factory, to use its funtion like binding

}