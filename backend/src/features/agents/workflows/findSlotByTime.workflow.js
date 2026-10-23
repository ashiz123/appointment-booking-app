export function findSlotByTimeWorkflow({ slotRepo }) {
  return async function getSlotByTime(args) {
    const { date, start_time } = args;
    const slot = await slotRepo.findSlotByStartTime(date, start_time);

    if (!slot) {
      return {
        type: 'error',
        message: `No any available slot found for ${date} at ${start_time}.`,
      };
    }

    return {
      type: 'data',
      data: {
        type: 'date',
        data: slot,
      },
    };
  };
}
