export function createAppointmentToolDispatcher({
  bookAppointmentWF,
  rescheduleWF,
  cancelWF,
  availabilityWF,
  findByTimeWF,
}) {
  return async function executeTool(name, args, from) {
    const phone = from.startsWith('+') ? from : `+${from}`;

    switch (name) {
      case 'book_appointment':
        return bookAppointmentWF({ ...args, phone });

      case 'reschedule_appointment':
        return rescheduleWF({ ...args, phone });

      case 'cancel_appointment':
        return cancelWF({ phone });

      case 'check_appointment_available':
        return availabilityWF(args);

      case 'find_slot_by_time':
        return findByTimeWF(args);

      default:
        throw new Error(`Unsupported tool: ${name}`);
    }
  };
}
