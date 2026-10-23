export const appointmentTools = [
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
            description: 'Date to check, in YYYY-MM-DD format.',
          },
        },
        required: ['date'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'find_slot_by_time',
      description:
        'Find an available appointment slot for a specific date and start time.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Appointment date, in YYYY-MM-DD format.',
          },
          start_time: {
            type: 'string',
            description: 'Appointment start time, in HH:mm format.',
          },
        },
        required: ['date', 'start_time'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description:
        'Book a new appointment. Use only customer details explicitly provided by the user. Never invent missing details.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Appointment date, in YYYY-MM-DD format.',
          },
          start_time: {
            type: 'string',
            description: 'Appointment start time, in HH:mm format.',
          },
          fullname: {
            type: 'string',
            description: 'Customer full name provided by the user.',
          },
          email: {
            type: 'string',
            description: 'Customer email address provided by the user.',
          },
        },
        required: ['date', 'start_time', 'fullname', 'email'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'reschedule_appointment',
      description:
        'Reschedule an existing appointment belonging to the WhatsApp sender. Do not invent a booking reference; the server identifies the booking from the sender.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'New appointment date, in YYYY-MM-DD format.',
          },
          start_time: {
            type: 'string',
            description: 'New appointment start time, in HH:mm format.',
          },
        },
        required: ['date', 'start_time'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_appointment',
      description:
        'Cancel an existing appointment belonging to the WhatsApp sender. The server identifies the booking from the sender; do not invent a booking reference.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
];
