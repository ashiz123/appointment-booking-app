export function cancelAppointmentWorkflow({ bookService }) {
  return async function cancelAppointment(phone) {
    const cancelAppointment = await bookService.cancelAppointment(phone);

    if (!cancelAppointment || !cancelAppointment.success) {
      return {
        type: 'error',
        message: `Cannot cancelled the appointment.`,
      };
    }

    return {
      type: 'data',
      data: 'Appointment is cancelled successfully',
    };
  };
}
