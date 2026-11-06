import { MessageRepository } from './features/sessionStore/messages/message.repository.js';
import { ConversationRepository } from './features/sessionStore/conversations/conversations.repository.js';
import { getDb } from './shared/config/db.js';
import { WhatsAppAgentClient } from './mcpClient.js';

export async function whatsAppAgentService() {
  const db = await getDb();

  const messageRepo = new MessageRepository(db);
  const conversationRepo = new ConversationRepository(db);

  return new WhatsAppAgentClient(conversationRepo, messageRepo);
}
