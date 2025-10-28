import {jest} from '@jest/globals';
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


    it('should display validation error', async() => {
        const result =  business.updateBusiness(null, { name: 'shop' }, 'user1');
        await expect(result).rejects.toThrow('validationError');
    });

   it('throw permission denied', async () => {
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
           owner : 'user1',
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
