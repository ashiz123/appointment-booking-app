

import { BusinessRepository } from "../../features/business/businessRepository.js";
import { getDb } from "../config/db.js";



export async function getOwnershipBusiness(repo, businessId, userId){
    
    // const db = await getDb();
    // const businessRepository = new BusinessRepository(db);
    const business = await repo.getBusinessById(businessId); // returns the document


    if (!business) {
        return { error: true, status: 404, message: "Business not found" };
    }

    if (business.owner.toString() !== userId.toString()) {
        return { error: true, status: 403, message: "Not authorized" };
    }

    return { error: false, business };
    


}


