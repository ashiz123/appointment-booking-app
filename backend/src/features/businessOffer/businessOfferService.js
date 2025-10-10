import { BusinessOfferFactory } from "./businessOfferFactory.js";
import { BusinessOfferRepository } from "./businessOfferRepository.js";
import { getDb } from "../../shared/config/db.js";


export async function createBusinessOfferService() {
  const db = new getDb();
  const repo = new BusinessOfferRepository(db); 
  return BusinessOfferFactory(repo);
}
