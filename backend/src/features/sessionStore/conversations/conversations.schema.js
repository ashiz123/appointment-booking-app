export async function runAgentConversationMigration(db) {
  db.createCollection('conversations', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'whatsappNumber',
          'status',
          'booking',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          whatsappNumber: {
            bsonType: 'string',
            description: 'WhatsApp number in normalized international format',
          },
          status: {
            enum: [
              'info',
              'checking_availability',
              'choosing_slot',
              'collecting_details',
              'booking',
              'completed',
              'cancelled',
            ],
          },
          booking: {
            bsonType: 'object',
            properties: {
              date: { bsonType: ['string', 'null'] },
              time: { bsonType: ['string', 'null'] },
              name: { bsonType: ['string', 'null'] },
              address: { bsonType: ['string', 'null'] },
              phone: { bsonType: ['string', 'null'] },
              email: { bsonType: ['string', 'null'] },
              appointmentId: { bsonType: ['string', 'null'] },
            },
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' },
        },
      },
    },
  });

  console.log('conversation migration created successfully');
}
