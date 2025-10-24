import {jest} from '@jest/globals';

import {ObjectId} from 'mongodb';


jest.mock('../../src/shared/utils/checkBusinessOwnership', () => ({
  checkBusinessOwnership: jest.fn()
}));

// Import after mocking
import { businessFactory } from "../../../src/features/business/businessFactory";



  describe('updateBusiness', () => {
    let business ;
    let mockBusinessRepository;


    beforeEach(() => {
        jest.clearAllMocks();
        mockBusinessRepository = {
            getBusinessByAuthUser: jest.fn(),
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

   it('should reject when business is not owned by the authenticated user', async () => {
        mockBusinessRepository.getBusinessByAuthUser.mockRejectedValue(
            new Error("Business is not belong to authenticated user")
        );

        await expect(
            business.updateBusiness('1', { name: 'Shop Updated' }, 'user1')
        ).rejects.toThrow("Business is not belong to authenticated user");
    });
        
    it('should update the business', async() => {
 
        // Mock the checkBusinessOwnership function properly
        mockBusinessRepository.getBusinessByAuthUser.mockResolvedValue({
            error: false,
            status: 200,
            business: { _id: '1', owner: 'user1' }
        });

       const updateBusiness  ={
           id : '1',
           ownerId : 'user1',
           name : 'Shop Updated'
        }

        // Mock the updateBusinessRepository to return a successful result
       mockBusinessRepository.updateBusinessRepository.mockResolvedValue(updateBusiness);

        const result = await business.updateBusiness('1', updateBusiness, 'user1');
        
        // Debug: Let's see what the actual result is
        console.log('Result:', result);

        expect(result.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.data).toBe('1');
    });

  })
