import { BusinessOfferFactory } from "./businessOfferFactory.js";
import { BusinessOfferRepository } from "./businessOfferRepository.js";
import { BusinessRepository } from "../business/businessRepository.js";
import { getDb } from "../../shared/config/db.js";


export async function businessOfferService() {
  const db = new getDb();
  const businessOfferRepo = new BusinessOfferRepository(db); 
  const businessRepo = new BusinessRepository(db);
  return BusinessOfferFactory(businessOfferRepo, businessRepo);
}
