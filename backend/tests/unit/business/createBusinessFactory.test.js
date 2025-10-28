

import {jest} from '@jest/globals';
import {ObjectId} from 'mongodb';
import { businessFactory } from "../../../src/features/business/businessFactory";




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
        .rejects.toThrow("validationError");
    });

     it('should throw business name already exist', async() => {
        mockBusinessRepository.existingBusinessNameWithEmail.mockResolvedValue(true);
        await expect(business.createBuisness({name : "shop1"}))
        .rejects.toThrow('resourceAlreadyExist');
     });



     it('should create the new business', async() => {
      mockBusinessRepository.existingBusinessNameWithEmail.mockResolvedValue(false);
      const fakeInsertedId = new ObjectId();
      mockBusinessRepository.createBusinessRepository.mockResolvedValue(
         { insertedId : fakeInsertedId,
          acknowledge : true
         }
        );

       const businessDetail = {
                name : 'testing business',
                owner : new ObjectId(),
                address : '137 shorncliff reoad',
                start_time: '09:00',
                end_time: "15:00"
        };

        const result = await business.createBuisness(businessDetail);

        expect(mockBusinessRepository.createBusinessRepository).toHaveBeenCalledTimes(1);
        expect(result.insertedId).toEqual(fakeInsertedId);


     })

  });








    






