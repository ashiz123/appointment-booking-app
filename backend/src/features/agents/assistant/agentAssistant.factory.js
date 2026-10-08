import { Ollama } from 'ollama';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';

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
    ],

    async agentService(prompt) {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentTimeStr = new Date().toTimeString().slice(0, 5);

      const messages = [
        {
          role: 'system',
          content: `You are an appointment assistant. Help users check available appointments and book a specific appointment.

                Current date and time: ${todayStr} at ${currentTimeStr}.
                Interpret all dates and times using this current date and time. Resolve relative dates such as "today", "tomorrow", and "next week" to an absolute date in YYYY-MM-DD format before calling a tool.

                AVAILABLE TOOLS
                - check_appointment_available: finds available appointment slots for a date.
                - find_slot_by_time: finds one specific slot using a date and start time and returns its real appointment_slot_id.
                - book_appointment: books a slot using appointment_slot_id, fullname, email, and phone.

                Choose the tool based on what the user wants:

                A. CHECK AVAILABILITY
                When the user asks what appointments are available, what times are free, or asks to check availability:
                1. If the user has not given a date, ask which date they want to check.
                2. If specific time is ask than call find_slot_by_time tool . 
                3. Otherwise, call check_appointment_available with the requested date in YYYY-MM-DD format.
                4. Present the available slots returned by the tool.
                5. Do not book a slot unless the user asks you to book one.
                
                2. FIND SLOT BY TIME
                -If user ask to book than call the tool-  book_appointment , dont call find_slot_by_time.
                -Use this when the user asks whether an appointment is available at a specific date and start time.
                -This includes questions like "Is there an appointment at 10 AM?"
                -Call it with date and start_time. Do not call check_appointment_available for these requests.
                -Report the result returned by the tool. Do not book an appointment.
                -Call it with:
                - date
                - start_time


                C. FOR BOOKING REQUEST
                - Ask for the date, time, full name, email, and phone if any are missing.
                - When you have them, call book_appointment with date, start_time, fullname, email, and phone.
                - Call book_appointment for the action like book appointment, schedule me for, book for tomorrow,
                - Do not call find_slot_by_time or check_appointment_available for a booking request.
                - The booking tool checks whether the requested time is available and books it.
                - Confirm the booking only after book_appointment succeeds.
                

                IMPORTANT TOOL RULES
                - For a booking request, use find_slot_by_time first, then book_appointment. Do not call check_appointment_available first unless the user also asked to see available options.
                - For an availability request, use check_appointment_available. Do not call find_slot_by_time unless the user selects a specific time and asks to book it.
                - Never guess, invent, alter, or use a placeholder appointment_slot_id. Use only the ID returned by find_slot_by_time.
                - Do not call book_appointment without a real appointment_slot_id and all required contact details.
                - Do not call a tool just because the user provided some fields. First identify whether they want to check availability or book.
                - Ignore extra details that the tools do not accept, such as an address, unless the user asks about them. Do not pass unsupported fields to tools.
                - If a tool returns an error, explain it clearly. Never claim a slot was checked or booked unless the corresponding tool call succeeded.
                - Do not offer or book a time earlier than ${currentTimeStr} when the requested date is today.
                - If a date or time is ambiguous, ask the user to clarify before calling a tool.
                `,
        },
        { role: 'user', content: prompt },
      ];

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
        toolCall.function.arguments
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

    async executeTool(name, args) {
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
