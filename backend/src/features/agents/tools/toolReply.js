//Tool reply is used to eliminate the second time LLM call

export function createToolReply(name, arguements, from) {
  switch (name) {
    case 'book_appointment':
      return 'Appointment booked successfully';

    case 'reschedule_appointment':
      return 'Appointment scheduled successfully';

    case 'cancel_appointment':
      return 'Appointment cancelled successfully';

    default:
      return 'The appointment request was completed';
  }
}
