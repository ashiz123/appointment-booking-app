export function createRescheduleAppoinmentWorkflow({ slotRepo, bookService }) {
  return async function rescheduleAppointmentWorkflow(args) {
    const { booking_reference, date, start_time } = args;

    const slot = await slotRepo.findSlotByStartTime(date, start_time);

    if (!slot) {
      return {
        type: 'error',
        message: `Cannot book: No available slot found for ${date} at ${start_time}.`,
      };
    }

    //reschedule by phone
    const rescheduleSlot = await bookService.rescheduleAppointment(
      booking_reference,
      slot._id
    );

    if (!rescheduleSlot) {
      return {
        type: 'error',
        message: `Cannot reschedule for given time slot.`,
      };
    }

    return {
      type: 'data',
      data: rescheduleSlot,
    };
  };
}
