/** Find the current unfinished conversation for a WhatsApp sender, or create one. */

export class ConversationRepository {
  constructor(db) {
    this.db = db;
    this.collection = 'conversations';
  }

  async getOrCreateConversation(from) {
    console.log('from', from);
    const whatsappNumber = from.trim();

    if (!whatsappNumber) {
      throw new Error('WhatsApp sender number is required');
    }

    const activeStatuses = [
      'info',
      'checking_availability',
      'choosing_slot',
      'collecting_details',
      'booking',
    ];

    try {
      return this.db.collection(this.collection).findOneAndUpdate(
        { whatsappNumber, status: { $in: activeStatuses } },
        {
          $setOnInsert: {
            whatsappNumber,
            status: 'info', // or an allowed initial status
            booking: {
              date: null,
              time: null,
              name: null,
              address: null,
              phone: null,
              email: null,
              appointmentId: null,
            },
            createdAt: new Date(),
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
          upsert: true,
        }
      );
    } catch (err) {
      console.dir(err.errInfo?.details, { depth: null });
      throw `Error from repository, ${err}`;
    }
  }
}
