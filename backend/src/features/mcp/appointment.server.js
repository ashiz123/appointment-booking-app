import { McpServer } from '@modelcontextprotocol/server'; //check installation
import { serveStdio } from '@modelcontextprotocol/server/stdio'; //check installation
import * as z from 'zod/v4';

import { slotService } from '../features/slot/slot.factory.js'; //check export
import { bookService } from '../features/bookSlot/bookSlot.factory.js'; //check export

const server = new McpServer({
  name: 'appointment-server',
  version: '1.0.0',
});

server.registerTool(
  'check_appointment_availability',
  {
    description: 'Find available appointment slots on a date.',
    inputSchema: {
      date: z.string().describe('Date in YYYY-MM-DD format'),
    },
  },
  async ({ date }) => {
    const slots = await slotService.showSlotsByDay(date);

    return {
      content: [{ type: 'text', text: JSON.stringify({ date, slots }) }],
    };
  }
);

server.registerTool(
  'book_appointment',
  {
    description: 'Book an available appointment slot for a customer.',
    inputSchema: {
      date: z.string(),
      start_time: z.string(),
      fullname: z.string(),
      email: z.string().email(),
      phone: z.string(),
    },
  },
  async ({ date, start_time, fullname, email, phone }) => {
    const slot = await slotService.findSlotByStartTime(date, start_time);

    if (!slot) {
      return {
        isError: true,
        content: [
          { type: 'text', text: 'That appointment slot is unavailable.' },
        ],
      };
    }

    // Adapt this object to the shape expected by your bookService.
    const booking = await bookService.bookSlot({
      slotId: slot._id,
      fullname,
      email,
      phone,
      status: 'booked',
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(booking) }],
    };
  }
);

server.registerTool(
  'cancel_appointment',
  {
    description: 'Cancel an appointment using its booking reference.',
    inputSchema: {
      booking_reference: z.string(),
      whatsapp_number: z.string(),
    },
  },
  async ({ booking_reference, whatsapp_number }) => {
    const result = await bookService.cancelAppointment(
      booking_reference,
      whatsapp_number
    );

    if (!result) {
      return {
        isError: true,
        content: [
          { type: 'text', text: 'The appointment could not be cancelled.' },
        ],
      };
    }

    return {
      content: [{ type: 'text', text: 'Appointment cancelled successfully.' }],
    };
  }
);

server.registerTool(
  'reschedule_appointment',
  {
    description: 'Move an appointment to an available date and time.',
    inputSchema: {
      booking_reference: z.string(),
      date: z.string(),
      start_time: z.string(),
    },
  },
  async ({ booking_reference, date, start_time }) => {
    const slot = await slotService.findSlotByStartTime(date, start_time);

    if (!slot) {
      return {
        isError: true,
        content: [
          { type: 'text', text: 'That appointment slot is unavailable.' },
        ],
      };
    }

    const result = await bookService.rescheduleAppointment(
      booking_reference,
      slot._id
    );

    if (!result) {
      return {
        isError: true,
        content: [
          { type: 'text', text: 'The appointment could not be rescheduled.' },
        ],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
    };
  }
);

serveStdio(() => server);
