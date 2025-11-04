import {jest} from '@jest/globals';
import {ObjectId} from 'mongodb';
import { BusinessOfferFactory } from '../../../src/features/businessOffer/businessOfferFactory';


describe('Create Business offer factory test', ()=> {

    let mockBusinessOfferRepo;
    let businessOfferFactory;

    beforeAll(() => {
        //clear previous mock
        jest.clearAllMocks();
   

        mockBusinessOfferRepo = {
            create: jest.fn()
        }

        businessOfferFactory = BusinessOfferFactory(mockBusinessOfferRepo);
        
    });

    it('should throw error name is required' , async() => {
         const offerData = {
                description : 'testing only', 
                businessId: new ObjectId,
                price : 25,
                duration: 30,
         };

         
           await expect(businessOfferFactory.addService(offerData))
            .rejects.toMatchObject({
                  error: [{ message: 'Name is required' }]
            });
     });

       it('should reject error price is required' , async() => {
         const offerData = {
                name : 'testing',
                description : 'testing only', 
                businessId: new ObjectId,
               
                duration: 30,
         };

         
           await expect(businessOfferFactory.addService(offerData))
            .rejects.toMatchObject({
                  error: [{ message: 'Price is required' }]
            });
     });

     it('should create business offer successfully', async() => {
        const offerData = {
                name : 'testing',
                description : 'testing only', 
                businessId: new ObjectId,
                price : 20,
                duration: 30,
         };

       mockBusinessOfferRepo.create.mockResolvedValue({insertedId : 'mockOfferId'});

       const businessOffer = await businessOfferFactory.addService(offerData);
       console.log(businessOffer);
       expect(businessOffer.status).toBe(200);
       expect(businessOffer.data.insertedId).toEqual('mockOfferId');
       expect(mockBusinessOfferRepo.create).toHaveBeenCalledWith(
             expect.objectContaining({
              name: 'testing',
              description: 'testing only',
              businessId: expect.any(ObjectId),
              price: 20,
              duration: 30,
              created_at: expect.any(Date),
              updated_at: expect.any(Date)
              })
       );
       
     })

     it('should reject with database error', async() => {
                const offerData = {
                name : 'testing',
                description : 'testing only', 
                businessId: new ObjectId,
                price : 20,
                duration: 30,
         };
         mockBusinessOfferRepo.create.mockRejectedValue(new Error('database failed'));
         await expect(businessOfferFactory.addService(offerData))
              .rejects.toThrow('database failed'); // or .toMatchObject if wrapped in AppError
         });
     });
       





