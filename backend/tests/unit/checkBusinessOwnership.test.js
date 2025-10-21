import { checkBusinessOwnerhip } from "../../src/shared/utils/checkBusinessOwnership";


describe('getOwnershipBusiness', () => {
    const mockRepo = {
        getBusinessById : jest.fn()
    };

    const businessId = 'biz123';
    const userId = 'user123';


    beforeEach(() => { 
        jest.clearAllMocks();
    });


    it('returns 404 if business not found', async() => {
        mockRepo.getBusinessById.mockResolvedValue(null);
        const result = await checkBusinessOwnerhip(mockRepo, businessId, userId);
        console.log(result);
        expect(result).toEqual({ error: true, status: 404, message: "Business not found" })
    });


    it('return 403 if user not the owner', async() => {
        mockRepo.getBusinessById.mockResolvedValue({owner : 'user127', name :"testing business", address : "127 shornclffa", start_time : "09:00", end_time: "12:00"});
        const result = await checkBusinessOwnerhip(mockRepo,businessId, userId );
        console.log(result);
        expect(result).toEqual({ error: true, status: 403, message: "Not authorized" });
    });


    it('return business object if found', async() => {
         mockRepo.getBusinessById.mockResolvedValue({owner : 'user123', name :"testing business", address : "127 shornclffa", start_time : "09:00", end_time: "12:00"});
         const result = await checkBusinessOwnerhip(mockRepo, businessId, userId);
         expect(result.status).toBe(200);
         expect(result.business).toEqual({
          owner: 'user123',
          name: 'testing business',
          address: '127 shornclffa',
          start_time: '09:00',
          end_time: '12:00'
        });
    })
})