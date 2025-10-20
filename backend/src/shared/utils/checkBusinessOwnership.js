

/**
 * 
 * @param {Object} repo 
 * @param {string} businessId 
 * @param {string} userId 
 * @returns {Promise<Object>}
 * 
 * This function call the db function named getBusinessById inside the businessRepository.
 * If the business does not exist
 * { error: true, status: 404, message: "Business not found" }
 * Business is not of the authenticated user
 * { error: true, status: 403, message: "Not authorized" }
 * If ownership is valid
 * {error : false, business : <businessObject>}
 * 
 */ 



export async function checkBusinessOwnerhip(repo, businessId, userId){
    
  
    const business = await repo.getBusinessById(businessId); // returns the document


    if (!business) {
        return { error: true, status: 404, message: "Business not found" };
    }

    if (business.owner.toString() !== userId.toString()) {
        return { error: true, status: 403, message: "Not authorized" };
    }

    return { error: false, status:200, business };
    


}


