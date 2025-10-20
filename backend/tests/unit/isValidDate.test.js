import { isValidDate } from "../../src/shared/middlewares/isValidDate";
import {jest} from '@jest/globals';

//NOTES: 

describe('test If the date is valid to book', () => {

    let req, res, next;

    beforeEach(() => {
        req =  {body : {}};
        res = {
            status : jest.fn().mockReturnThis(), //we need to use mockReturnThis to call the to call the chaining method otherwise its undefined.
            json : jest.fn()
        }
        next = jest.fn()
    });


    it('should return 400 if date is before than today or current time', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        req.body.date = yesterday.toISOString();
        isValidDate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalledWith();
    });

    it('should return next if date is greater than current time', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        req.body.date = tomorrow.toISOString();
        isValidDate(req, res, next);
        expect(next).toHaveBeenCalledWith();
    })


});