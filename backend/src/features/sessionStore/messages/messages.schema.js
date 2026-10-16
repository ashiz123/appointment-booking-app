export async function runAgentMessagingMigration(db) {
  db.createCollection('messages', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['conversationId', 'role', 'content', 'createdAt'],
        properties: {
          conversationId: { bsonType: 'objectId' },
          role: { enum: ['user', 'assistant', 'tool'] },
          content: { bsonType: 'string' },
          createdAt: { bsonType: 'date' },
        },
      },
    },
  });
}
