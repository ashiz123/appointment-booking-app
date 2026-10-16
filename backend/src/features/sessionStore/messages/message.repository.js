export class MessageRepository {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('messages');
  }

  async createMessage({ conversationId, role, content }) {
    try {
      const now = new Date();
      const message = {
        conversationId, // Keep the ObjectId from conversation._id
        role,
        content,
        createdAt: now,
      };

      await this.collection.insertOne(message);
      console.log('message recorded successfully');
    } catch (error) {
      console.log('Error from message repository', error);
    }
  }

  async getRecentMessages(conversationId, limit = 20) {
    const safeLimit = Math.max(1, Math.min(Math.floor(limit), 100));

    const messages = await this.collection
      .find({ conversationId })
      .sort({ createdAt: -1, _id: -1 }) //latest 20 first
      .limit(safeLimit)
      .toArray();

    return messages.reverse(); //on that latest 20, get the oldest one first
  }
}
