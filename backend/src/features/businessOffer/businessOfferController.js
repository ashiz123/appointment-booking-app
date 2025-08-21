import { createBusinessOfferService } from "./businessOfferService.js";


export async function createBusinessOffer(req, res){
try {
    const service = await createBusinessOfferService(); 
    const result = await service.addService(req.body);     
    return res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}