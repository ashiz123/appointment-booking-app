import { Ollama } from 'ollama';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';
import { getSystemPrompt } from '../tools/systemPrompt.js';
import { checkGreeting } from '../../../shared/utils/checkGreeting.js';
import { finalResponseUsingLLM } from '../tools/finalResponseUsingLLM.js';
import { createToolReply } from '../tools/toolReply.js';
import { getStatePrompt } from '../tools/statePrompt.js';

export function agentAssistantFactory(
  slotRepo,
  messageRepo,
  conversationRepo,
  bookService
) {
  return {
    ollama: new Ollama({
      host: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
    }),

    maxToolRounds: 5,
    historyLimit: 20,

    // greetingPattern:
    //   /^(hi|hello|hey|good morning|good afternoon|good evening)[.!?,\s]*$/i,

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
      const conversation = await conversationRepo.getOrCreateConversation(from);
      const convId = conversation._id;
      await messageRepo.createMessage({
        conversationId: convId,
        role: 'user',
        content: prompt,
      });

      if (checkGreeting(prompt)) {
        let reply =
          'Hi! I can help you check availability, book, reschedule, or cancel an appointment.';
        await messageRepo.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: reply,
        });

        return { type: 'answer', answer: reply };
      }

      const history = await messageRepo.getRecentMessages(
        convId,
        this.historyLimit
      );

      const stateMessage = getStatePrompt(conversation);

      const systemPrompt = getSystemPrompt();
      const systemMessage = JSON.stringify(systemPrompt[0]);

      const messages = [
        { role: 'system', content: systemMessage },
        stateMessage,
        ...history.map(({ role, content }) => ({ role, content })),
      ];

      const initialResponse = await this.ollama.chat({
        model: 'qwen3',
        messages,
        tools: this.tools,
        think: false,
        options: { num_predict: 100 },
      });

      const assistantMessage = initialResponse.message;

      const toolCalls = assistantMessage.tool_calls?.[0];

      if (!toolCalls) {
        const answer = assistantMessage.content ?? '';

        console.log('asnwer inside toocalls', answer);

        await messageRepo.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: answer,
        });

        //exit the function from here.
        return {
          type: 'answer',
          answer,
        };
      }

      const toolName = toolCalls.function.name;
      const toolArgs = toolCalls.function.arguments;
      messages.push(assistantMessage);

      //Call the tool and get the response
      const result = await this.executeTool(toolName, toolArgs, from);
      console.log('result', result);

      //Answer with LLM
      // const answer = await finalResponseUsingLLM(
      //   convId,
      //   messages,
      //   toolName,
      //   result
      // );

      //Answer manually
      const answer = createToolReply(toolName, toolArgs, from);
      console.log('answer', answer);

      return { type: 'answer', answer };
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
