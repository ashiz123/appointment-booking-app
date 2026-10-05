import { Ollama } from 'ollama';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';

export function agentAssistantFactory(slotRepo, bookRepo) {
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
          content: `
            You are a helpful booking assistant.
            Current date and time: ${todayStr} at ${currentTimeStr}.
            Always resolve relative dates (like "today", "tomorrow", or "after a week") into absolute YYYY-MM-DD format when calling tools.
            
            Time Filtering Rule for Today:
            - Do not allow booking slots that are in the past relative to the current time (${currentTimeStr}).

            STRICT RULES:
          - NEVER guess, invent, or use placeholder IDs (like '12345') for 'appointment_slot_id'. 
          - You MUST execute 'find_slot_by_time' first to obtain the real MongoDB ObjectId from the database. Only use the ID returned by that tool.
            
            Booking & Availability Workflow:
            1. Use check_appointment_available if the user wants to see general free slots for a date.
          
            3. To use book_appointment, you MUST have:
                - appointment_slot_id \
                - fullname
                - email
                - phone
            4. Ask for any missing details (like email or phone or fullname) before calling book_appointment .
            
            If a tool returns an error, explain it clearly.
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
              appointment_slot_id: slot._id.toString(),
              date: date,
              start_time: start_time,
              status: slot.booked === 0 ? 'available' : 'booked',
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
          const createdBooking = await bookRepo.bookingSlot(data);

          return {
            type: 'data',
            data: createdBooking,
          };
        }

        default:
          return { error: 'unknown tool' };
      }
    },
  };
}
