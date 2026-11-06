import { getDb } from './shared/config/db.js';
import { McpServer } from '@modelcontextprotocol/server';
import { bookSlotService } from './features/bookSlot/bookSlotService.js';
import { SlotRepository } from './features/slot/slotRepository.js';
import { MessageRepository } from './features/sessionStore/messages/message.repository.js';
import { ConversationRepository } from './features/sessionStore/conversations/conversations.repository.js';
import { bookAppointmentWorkflow } from './features/agents/workflows/bookAppointment.workflow.js';
import { createRescheduleAppoinmentWorkflow } from './features/agents/workflows/rescheduleAppointment.workflow.js';
import { validateFutureDate } from './shared/utils/validateFutureDate.js';
import { z } from 'zod';

export async function createMCPServer() {
  const db = await getDb();
  const slotRepo = new SlotRepository(db);

  const messageRepo = new MessageRepository(db);
  const conversationRepo = new ConversationRepository(db);
  const bookService = await bookSlotService();

  const bookAppointment = bookAppointmentWorkflow({
    slotRepo,
    bookService,
  });
  const rescheduleAppointment = createRescheduleAppoinmentWorkflow({
    slotRepo,
    bookService,
  });

  const server = new McpServer({
    name: 'appointment-booking',
    version: '1.0.0',
  });

  // 1. Check Appointment Available
  server.registerTool(
    'check_appointment_available',
    {
      description: 'Check available appointment slots for a given date.',
      inputSchema: z.object({
        date: z.string().describe('Date to check, in YYYY-MM-DD format.'),
      }),
    },
    async ({ date }) => {
      try {
        validateFutureDate(date);

        const result = await slotRepo.showSlotsByDay(date);

        const sanitizedResult = result.map((slot) => ({
          time: slot.slot_start,
          available: slot.total_seats,
        }));

        return {
          content: [
            { type: 'text', text: JSON.stringify(sanitizedResult, null, 2) },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Internal database error processing slot check.',
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    'find_slot_by_time',
    {
      description: 'Find an available slot for specific date and time',
      inputSchema: z.object({
        date: z.string().describe('Appointment date, in YYYY-MM-DD format.'),
        time: z.string().describe('Appointment start time, in HH:MM format. '),
      }),
    },

    async ({ date, time }) => {
      //guardrail
      validateFutureDate(date, time);

      const result = await slotRepo.findSlotByStartTime(date, time);

      // 1. Guard against null / missing slot
      if (!result) {
        throw new Error(
          `No available slot found for ${date} at ${time}. It may be fully booked, already passed, or not yet released.`
        );
      }

      // 2. Safe to access properties now because result is guaranteed to be an object
      const sanitizedResult = {
        date: result.slot_start,
        totalSeats: result.total_seats,
        bookedSeats: result.booked,
        remainingSeats: result.total_seats - result.booked,
        available: true,
      };

      return {
        content: [
          { type: 'text', text: JSON.stringify(sanitizedResult, null, 2) },
        ],
      };
    }
  );

  server.registerTool(
    'book_appointment',
    {
      description: 'Book an appointment',
      inputSchema: z.object({
        date: z.string().describe('Appointment date, in YYYY-MM-DD format.'),
        start_time: z
          .string()
          .describe('Appointment start time, in HH:MM format. '),
        fullname: z.string().describe('Fullname of the user'),
        email: z.string().describe('Email of the user'),
        phone: z
          .string()
          .transform((val) => {
            let cleaned = val.replace(/[^\d+]/g, ''); // removes spaces, dashes, brackets
            // If they provided a UK local format starting with 07 instead of +44, auto-correct it
            if (cleaned.startsWith('0')) {
              cleaned = '+44' + cleaned.slice(1);
            }
            return cleaned;
          })
          .pipe(
            z.string().regex(/^\+44\d{10}$/, {
              message:
                'Phone number must start with +44 followed by 10 digits (e.g., +447123456789)',
            })
          )
          .describe(
            'Phone number of the user, starting with +44 followed by 10 digits'
          ),
      }),
    },

    async ({ date, start_time, fullname, email, phone }) => {
      try {
        //console and logging way
        // process.stderr.write(`Booking service started \n`);
        // console.error('it works well');

        //guardrail
        validateFutureDate(date, start_time);

        const result = await bookAppointment({
          date,
          start_time,
          fullname,
          email,
          phone,
        });

        if (result.type === 'validation') {
          return {
            content: [
              {
                type: 'text',
                text: `Validation failed:\n${JSON.stringify(result.errors, null, 2)}`,
              },
            ],
          };
        }

        if (result.type === 'error') {
          return {
            content: [
              {
                type: 'text',
                text: result.message,
              },
            ],
          };
        }

        return {
          content: [
            { type: 'text', text: JSON.stringify(result.data, null, 2) },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Unexpected Tool Crash: ${error.message}\n${error.stack}`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    'reschedule_appointment',
    {
      description: 'Reschedule an appointment',
      inputSchema: z.object({
        date: z.string().describe('Appointment date, in YYYY-MM-DD format.'),
        start_time: z
          .string()
          .describe('Appointment start time, in HH:MM format. '),
        booking_reference: z.string().describe('Booking reference'),
      }),
    },

    async ({ date, start_time, booking_reference }) => {
      const result = rescheduleAppointment({
        date,
        start_time,
        booking_reference,
      });

      return {
        content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }],
      };
    }
  );

  //find slot by time
  // server.registerTool(
  //   'find_slot_by_time', //title
  //   'Find an available appointment slot for a specific date and start time.', //description
  //   //arguements
  //   {
  //     date: z.string().describe('Appointment date, in YYYY-MM-DD format.'),
  //     start_time: z
  //       .string()
  //       .describe('Appointment start time, in HH:mm format.'),
  //   },

  //   //call the tool
  //   async ({ date, time }) => {
  //     const result = await slotRepo.findSlotByStartTime(date, time);
  //     return {
  //       content: [
  //         {
  //           type: 'text',
  //           text: JSON.stringify(result, null, 2),
  //         },
  //       ],
  //     };
  //   }
  // );

  return server;
}
