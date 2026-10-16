import { getDb } from '../../../shared/config/db.js';
import { SlotRepository } from '../../slot/slotRepository.js';
import { bookSlotService } from '../../bookSlot/bookSlotService.js';
import { agentAssistantFactory } from './agentAssistant.factory.js';
import { MessageRepository } from '../../sessionStore/messages/message.repository.js';
import { ConversationRepository } from '../../sessionStore/conversations/conversations.repository.js';

export async function agentAssistantService() {
  const db = await getDb();
  const slotRepo = new SlotRepository(db);
  const messageRepo = new MessageRepository(db);
  const conversationRepo = new ConversationRepository(db);
  const bookService = await bookSlotService();

  return agentAssistantFactory(
    slotRepo,
    messageRepo,
    conversationRepo,
    bookService
  );
}
