import { Ollama } from 'ollama';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';
import { getAppointmentMessages } from '../tools/getAppointmentMessages.js';

export function agentAssistantFactory(slotRepo, bookRepo, bookService) {
  return {
    ollama: new Ollama({
      host: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
    }),
    tools: [
      {
        type: 'function',
        function: {
          name: 'check_appointment_available',
          description: 'Check available appointment slots for a given date.',
          parameters: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description:
                  'The date to check availability for, formatted as YYYY-MM-DD.',
              },
            },
            required: ['date'],
          },
        },
      },

      {
        type: 'function',
        function: {
          name: 'find_slot_by_time',
          description:
            'Find an available appointment slot and its given a specific date and start time',
          parameters: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description:
                  'The date of the appointment, formatted as YYYY-MM-DD.',
              },
              start_time: {
                type: 'string',
                description:
                  'The starting time of the appointment slot, formatted as HH:mm (e.g., "09:00").',
              },
            },
            required: ['date', 'start_time'],
          },
        },
      },

      {
        type: 'function',
        function: {
          name: 'book_appointment',
          description: 'Book a new appointment slot.',
          parameters: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description: 'The appointment date, in YYYY-MM-DD format.',
              },
              start_time: {
                type: 'string',
                description: 'The appointment start time, in HH:mm format.',
              },
              fullname: {
                type: 'string',
                description: 'The full name of the person booking.',
              },
              email: {
                type: 'string',
                description: 'The email address of the person booking.',
              },
              phone: {
                type: 'string',
                description: 'The phone number of the person booking.',
              },
              status: {
                type: 'string',
                description: 'The appointment status, usually "booked".',
              },
            },
            required: ['date', 'start_time', 'fullname', 'email', 'phone'],
          },
        },
      },

      {
        type: 'function',
        function: {
          name: 'reschedule_appointment',
          description: 'Reschedule an existing appointment to a new slot.',
          parameters: {
            type: 'object',
            properties: {
              booking_reference: {
                type: 'string',
                description: 'Reference for the existing booking.',
              },
              date: {
                type: 'string',
                description: 'The appointment date, in YYYY-MM-DD format.',
              },
              start_time: {
                type: 'string',
                description: 'The appointment start time, in HH:mm format.',
              },
            },
            required: ['date', 'start_time', 'booking_reference'],
            additionalProperties: false,
          },
        },
      },

      {
        type: 'function',
        function: {
          name: 'reschedule_appointment',
          description: 'Reschedule an existing appointment to a new slot.',
          parameters: {
            type: 'object',
            properties: {
              booking_reference: {
                type: 'string',
                description: 'Reference for the existing booking.',
              },
              date: {
                type: 'string',
                description: 'The appointment date, in YYYY-MM-DD format.',
              },
              start_time: {
                type: 'string',
                description: 'The appointment start time, in HH:mm format.',
              },
            },
            required: ['date', 'start_time', 'booking_reference'],
            additionalProperties: false,
          },
        },
      },

      {
        type: 'function',
        function: {
          name: 'cancel_appointment',
          description: 'This tool cancel the appointment',
          parameters: {
            type: 'object',
            properties: {
              booking_reference: {
                type: 'string',
                description: 'Reference for the existing booking.',
              },
            },
            required: ['phone', 'booking_reference'],
            additionalProperties: false,
          },
        },
      },
    ],

    async agentService(from, prompt) {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentTimeStr = new Date().toTimeString().slice(0, 5);

      const messages = getAppointmentMessages(todayStr, currentTimeStr, prompt);

      // 2. When a user wants to **book** a specific time (e.g., "book me at 09:00"), **first use find_slot_by_time** to look up and retrieve the appointment_slot_id.

      const initialResponse = await this.ollama.chat({
        model: 'qwen3',
        messages,
        tools: this.tools,
        think: false,
        options: { num_predict: 100 },
      });

      const toolCall = initialResponse.message.tool_calls?.[0];
      console.log({
        content: initialResponse.message.content,
        toolCalls: initialResponse.message.tool_calls?.[0],
      });

      if (!toolCall) {
        return {
          type: 'answer',
          answer: initialResponse.message.content,
        };
      }

      messages.push(initialResponse.message);

      const result = await this.executeTool(
        toolCall.function.name,
        toolCall.function.arguments,
        from
      );

      messages.push({
        role: 'tool',
        tool_name: toolCall.function.name,
        content: JSON.stringify(result),
      });

      const finalResponse = await this.ollama.chat({
        model: 'qwen3',
        messages,
        tools: this.tools,
        think: false,
        options: {
          num_predict: 100,
        },
      });

      return {
        type: 'answer',
        answer: finalResponse.message.content,
      };
    },

    async executeTool(name, args, from) {
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
          console.log('createdBooking', createdBooking);

          return {
            type: 'data',
            data: createdBooking,
          };
        }

        case 'reschedule_appointment': {
          const { booking_reference, date, start_time } = args;

          const slot = await slotRepo.findSlotByStartTime(date, start_time);

          if (!slot) {
            return {
              type: 'error',
              message: `Cannot book: No available slot found for ${date} at ${start_time}.`,
            };
          }

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
        }

        case 'cancel_appointment': {
          const { booking_reference } = args;

          const cancelAppointment = await bookService.cancelAppointment(
            booking_reference,
            from
          );

          if (!cancelAppointment) {
            return {
              type: 'error',
              message: `Cannot reschedule for given time slot.`,
            };
          }

          return {
            type: 'data',
            data: 'Appointment cancelled successfully',
          };
        }

        default:
          return { error: 'unknown tool' };
      }
    },

    async fetchResponseToUser(from, response) {
      console.log('response', response);

      const result = await fetch(
        `https://graph.facebook.com/v26.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WABA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: from,
            type: 'text',
            text: { body: response.answer },
          }),
        }
      );

      if (!result.ok) {
        const details = await result.text();
        throw new Error(`WhatsApp send failed (${result.status}): ${details}`);
      }

      console.log('WhatsApp accepted the reply:', await result.json());
    },
  };
}
