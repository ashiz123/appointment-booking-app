
import { timeToMinute } from "../../src/shared/utils/dateTimeCovert";



describe("timeToMinute", () => {
    test('converts "00:00" to 0 minutes', () => {
        expect(timeToMinute("00:00")).toBe(0);
    })


     test('converts "01:00" to 60 minutes', () => {
        expect(timeToMinute("01:00")).toBe(60);
    });
})