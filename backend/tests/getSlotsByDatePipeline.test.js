

import { getSlotsByDatePipeline } from "../src/features/slot/pipelines/slotPipeline";

describe('Slot Pipelines', () => {
    test('getSlotsByDatePipeline returns correct stages', () => {
        const start = new Date('2025-09-02T00:00:00Z');
        const end = new Date('2025-09-03T00:00:00Z');

        const pipeline = getSlotsByDatePipeline(start, end);

        expect(Array.isArray(pipeline)).toBe(true);
        expect(pipeline.length).toBe(2); // $match + $project

        // Check $match stage
        expect(pipeline[0]).toHaveProperty('$match');
        expect(pipeline[0].$match.slot_start.$gte).toEqual(start);
        expect(pipeline[0].$match.slot_start.$lt).toEqual(end);

        // Check $project stage
        expect(pipeline[1]).toHaveProperty('$project');
        expect(pipeline[1].$project).toEqual({
            _id: 0,
            slot_start: 1,
            booked: 1,
            total_seats: 1
        });
    });
});