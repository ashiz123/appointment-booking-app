import { authenticate } from "../../src/shared/middlewares/authMiddleware"; 
// import {jest} from '@jest/globals';

 
describe('User authentication', () => {
  
    let req, res, next;

    beforeEach(() => {
        req = {headers : {}};
        res = {
            status : jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    })

    it('should throw the status of 401 with message user not authorized', () => {
        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message : 'User not authorized, Token required'});
        expect(next).not.toHaveBeenCalled();
    });


    it('Should authorize the user and call the next', () => {
        req = {headers : {authorization : 'Bearer fake-token'}};
        authenticate(req,res,next);
        expect(next).toHaveBeenCalled();
    })

}); 