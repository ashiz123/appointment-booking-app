import { getDb } from "../../shared/config/db.js";
import { BusinessRepository } from "./businessRepository.js";
import { businessFactory } from "./businessFactory.js";
// import { BusinessOfferRepository } from "../businessOffer/businessOfferRepository.js";



export async function businessService (){
    const db = await getDb();
    const repo = new BusinessRepository(db);
    // const businessOfferRepo = new BusinessOfferRepository(db);
    return businessFactory(repo);
}