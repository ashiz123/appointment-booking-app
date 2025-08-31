import { getDb } from "../../shared/config/db";
import { slotFactory } from "./slotFactory";
import { SlotRepository } from "./slotRepository";

export async function slotService(){
    const db = await getDb();
    const repo = new SlotRepository(db);
    return slotFactory(repo);
}