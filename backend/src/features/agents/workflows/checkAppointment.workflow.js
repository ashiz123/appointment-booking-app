export function checkAvailabilityWorkflow({ slotRepo }) {
  return async function availabilityWorkflow(args) {
    const { date } = args;

    const slots = await slotRepo.showSlotsByDay(date);
    return {
      type: 'data',
      data: slots,
    };
  };
}
