import { buildBooking } from '../../bookSlot/bookingSlotModel.js';
import { hasUserDetails } from '../../../shared/utils/hasUserDetails.js';

export function bookAppointmentWorkflow({ slotRepo, bookService }) {
  return async function bookAppointment(args) {
    const { date, start_time, fullname, email, status, phone } = args;

    const userDetail = hasUserDetails({
      fullname,
      email,
      date,
      start_time,
      phone,
    });

    console.log('phone number', phone);

    if (userDetail.errors?.length > 0) {
      const result = userDetail.errors;

      console.log('user detail errors', result);
      return {
        type: 'validation',
        errors: result,
      };
    }

    const slot = await slotRepo.findSlotByStartTime(date, start_time);

    if (!slot) {
      return {
        type: 'error',
        message: `Cannot book: No available slot found for ${date} at ${start_time}.`,
      };
    }

    // 2. Build the booking using the REAL database _id
    const builtData = buildBooking(
      slot._id,
      date,
      start_time,
      fullname,
      email,
      phone,
      status || 'booked'
    );

    console.log('build booking', builtData);

    // 3. Save to database
    // const createdBooking = await bookRepo.bookingSlot(data);
    const createdBooking = await bookService.bookSlot(builtData);

    if (!createdBooking) {
      console.error('Problem with booking. Booking unsuccessful');
      throw new Error('Booking is unsuccessful');
    }

    return {
      type: 'data',
      data: createdBooking,
      message: 'Appointment booked successfully',
    };
  };
}
