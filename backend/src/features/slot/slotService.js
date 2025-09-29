import { getDb } from "../../shared/config/db.js";
import { slotFactory } from "./slotFactory.js";
import { SlotRepository } from "./slotRepository.js";
import { BusinessRepository } from "../business/businessRepository.js";
import { BusinessOfferRepository } from "../businessOffer/businessOfferRepository.js";


export async function slotService(){
    const db = await getDb();
    const slotRepo = new SlotRepository(db);
    const businessRepo = new BusinessRepository(db);
    const businessOfferRepo = new BusinessOfferRepository(db); 
    return slotFactory(slotRepo, businessRepo, businessOfferRepo);
}