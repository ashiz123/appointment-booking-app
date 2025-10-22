
import { checkBusinessOwnership } from "../../src/shared/utils/checkBusinessOwnership";
import {jest} from '@jest/globals';
import { businessFactory } from "../../src/features/business/businessFactory";

  jest.mock('../../src/shared/utils/checkBusinessOwnership', () => ({
    checkBusinessOwnership : jest.fn()
  }));




describe('createBusiness', () => {
   let business;
   let mockBusinessRepository;

    beforeEach(() => {
        jest.clearAllMocks();
         mockBusinessRepository = {
            existingBusinessNameWithEmail: jest.fn(),
            createBusinessRepository : jest.fn()
        }
        business = businessFactory(mockBusinessRepository);

    });


    it('should throw error of business name is required',  async () => {
       await expect( business.createBuisness({ address: "Street 1" }, "user1"))
        .rejects.toThrow("Business name is required");
    });

     it('should throw business name already exist', async() => {
        mockBusinessRepository.existingBusinessNameWithEmail.mockResolvedValue(true);
        await expect(business.createBuisness({name : "shop1"}))
        .rejects.toThrow('Business name already exist');
     });


     //TODO: WRITE FOR CREATING BUSINESS SUCCESSFUL

  });






  describe('updateBusiness', () => {
    let business ;
    let mockBusinessRepository;


    beforeEach(() => {
        jest.clearAllMocks();
        mockBusinessRepository = {
            updateBusinessRepository : jest.fn()
        }
        business = businessFactory(mockBusinessRepository);
        
    });


    it('should display business id required', async() => {
        const result = await business.updateBusiness(null, { name: 'shop' }, 'user1')
        expect(result).toEqual({
            status: 400,
            success: false,
            message: 'Business Id is required',
            });
    });

  })


    






