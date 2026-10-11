import { SlotRepository } from '../../slot/slotRepository.js';
import { getDb } from '../../../shared/config/db.js';
import { bookSlotService } from '../../bookSlot/bookSlotService.js';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';

const db = await getDb();
const slotRepo = new SlotRepository(db);
const bookService = await bookSlotService();

export const executeTool = async (name, args) => {
  switch (name) {
    case 'check_appointment_available': {
      const slots = await slotRepo.showSlotsByDay(args.date);
      return {
        type: 'data',
        data: slots,
      };
    }

    case 'find_slot_by_time': {
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
    }

    case 'book_appointment': {
      const { date, start_time, fullname, email, phone, status } = args;

      // 1. Safely look up the real slot ID from the database on the backend
      const slot = await slotRepo.findSlotByStartTime(date, start_time);

      if (!slot) {
        return {
          type: 'error',
          message: `Cannot book: No available slot found for ${date} at ${start_time}.`,
        };
      }

      // 2. Build the booking using the REAL database _id
      const data = buildBooking(
        slot._id,
        fullname,
        email,
        phone,
        status || 'booked'
      );

      console.log('data', data);

      // 3. Save to database
      // const createdBooking = await bookRepo.bookingSlot(data);
      const createdBooking = await bookService.bookSlot(data);

      return {
        type: 'data',
        data: createdBooking,
      };
    }

    // case 'reschedule_appointment': {
    //   const { new_start_time, new_date } = args;

    //   return 'reschedule the appointment';
    // }

    default:
      return { error: 'unknown tool' };
  }
};
