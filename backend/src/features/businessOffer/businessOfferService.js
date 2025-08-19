import { BusinessOfferFactory } from "./businessOfferFactory.js";
import { BusinessOfferRepository } from "./businessOfferRepository.js";


export async function createBusinessOfferService() {
  const repo = await new BusinessOfferRepository().init(); 
  return BusinessOfferFactory(repo);
}
