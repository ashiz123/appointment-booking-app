// **ASSUMES you remove the jest.mock block at the top of the file**
import { Car } from '../../src/car'; 

describe('Testing car class', () => {

  
   let nameSpy;
   let typeSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        // Spy on the prototype method and mock its implementation
        nameSpy = jest.spyOn(Car.prototype, 'name').mockReturnValue('mocked car name');
        typeSpy = jest.spyOn(Car.prototype, 'typeCartest').mockReturnValue('mock type func');
        
    });


    it('should testing name function', () => {
        const car = new Car();
        expect(car.name()).toEqual('mocked car name');
        car.typeCartest('SUV');
        expect(nameSpy).toHaveBeenCalledTimes(1); // You can now spy on it
        expect(typeSpy).toHaveBeenCalledTimes(1);
        expect(typeSpy).toHaveBeenCalledWith('SUV');
    })
})