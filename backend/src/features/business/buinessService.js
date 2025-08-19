import { existingBusinessNameWithEmail , createBusinessRepo} from "./businessRepository.js";




export async function createBusinessService({name, address, email}){
   
   //validation
    if(!name || !email){
        throw new Error('Name and email are required');
    }
    const exists = await existingBusinessNameWithEmail(name, email);
    if(exists){
        throw new Error('Business already exist');
    }

    const businessToSave = {
        name : name,
        address : address,
        email: email
    };

    return createBusinessRepo(businessToSave);

}