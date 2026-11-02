import { ObjectId } from 'mongodb';
import { buildBooking } from './bookingSlotModel.js';
import {
  sendAppointmentEmail,
  sendAppointmentCancelEmail,
} from '../../shared/config/mailer.js';

export function bookSlotFactory(bookRepo, slotRepo) {
  return {
    async bookSlot(data) {
      try {
        const { request_date, request_time, fullname, email, phone, status } =
          data;

        const bookedSeat = await slotRepo.bookSeat(request_date, request_time); //To update the seats of slot first
        console.log('bookedSeat', bookedSeat);

        if (!bookedSeat.success) {
          throw new Error('Booking seat failed');
        }

        const { _id } = bookedSeat.slot;

        //To do the booking for that above seat
        const bookingDetail = {
          appointment_slot_id: _id,
          fullname,
          email,
          phone,
          status,
        };

        //Add the booking record
        const bookSlot = await bookRepo.bookingSlot(bookingDetail);

        return bookSlot;
      } catch (err) {
        console.log('Error to book slot', err);
        throw err;
        // if (bookedSeat.acknowledged && bookedSeat.modifiedCount > 0) {
        //   const canceled = await slotRepo.unbookingSeat(slot_id);
        //   if (canceled.modifiedCount === 1) {
        //     console.log('something misssing here');
        //   }
        // }

        // return { success: false, status: 409, message: err.message };
      }
    },

    async rescheduleAppointment(booking_reference, appointment_slot_id) {
      console.log('appointment_slot_id:', appointment_slot_id);
      const slot_id = new ObjectId(String(appointment_slot_id));
      const isValidDateToBook = await slotRepo.isDateValid(slot_id); //check the valid date to book. Is it greater than current date and time

      if (!isValidDateToBook) {
        return {
          success: false,
          status: 400,
          message: 'Date must be greater than current date and time',
        };
      }

      try {
        const previousBooking =
          await bookRepo.fetchBookingDetail(booking_reference);

        await slotRepo.unbookingSeat(previousBooking.appointment_slot_id);

        await slotRepo.bookingSeat(slot_id);

        const reschedule = await bookRepo.rescheduleBooking(
          booking_reference,
          slot_id
        );

        if (!reschedule) {
          await slotRepo.unbookingSeat(slot_id);
          await slotRepo.bookingSeat(previousBooking.appointment_slot_id);
          throw new Error('Booking could not be created');
        }

        const text = 'Your appointment is rescheduled ';
        await sendAppointmentEmail(
          reschedule.email,
          reschedule.fullname,
          reschedule.slot_start,
          reschedule.booking_reference,
          text
        );
        return {
          success: true,
          status: 200,
          message: 'Rescheduled successfully done',
        };
      } catch (err) {
        return { success: false, status: 409, message: err.message };
      }
    },

    async cancelAppointment(booking_reference, from) {
      try {
        //Get the email from the user collection.
        if (!booking_reference) {
          throw new Error('Booking reference is required');
        }

        const cancelAppointment = await bookRepo.cancleBookedSlot(
          booking_reference,
          from
        ); //send from to repo

        if (
          cancelAppointment.matchedCount === 0 ||
          cancelAppointment.modifiedCount === 0
        ) {
          throw new Error(
            'Appointment not found to cancel or already cancelled'
          );
        }

        // const text = 'Your appointment is cancelled ';
        // await sendAppointmentCancelEmail(
        //   email,
        //   booking_reference,
        //   text,
        //   new Date()
        // );
        return {
          success: true,
          status: 200,
          message: 'Appointment successfully cancelled',
        };
      } catch (err) {
        return { success: false, status: 409, message: err.message };
      }
    },

    async getBookedAppointment(fromDate, toDate, authId) {
      try {
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          throw new Error(
            'From and To date are required and must be valid dates'
          );
        }

        const bookedAppointment = await bookRepo.fetchBookingByDate(
          fromDate,
          toDate,
          authId
        );
        return { success: true, status: 200, data: bookedAppointment };
      } catch (err) {
        return { success: false, status: 409, message: err.message };
      }
    },
  };
}
