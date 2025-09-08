import { getDb } from "../../shared/config/db.js";
import { slotFactory } from "./slotFactory.js";
import { SlotRepository } from "./slotRepository.js";

export async function slotService(){
    const db = await getDb();
    const repo = new SlotRepository(db);
    return slotFactory(repo);
}