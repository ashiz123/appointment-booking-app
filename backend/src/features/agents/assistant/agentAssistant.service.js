import { getDb } from '../../../shared/config/db.js';
import { SlotRepository } from '../../slot/slotRepository.js';
import { bookSlotService } from '../../bookSlot/bookSlotService.js';
import { BookSlotRepository } from '../../bookSlot/bookSlotRepository.js';
import { agentAssistantFactory } from './agentAssistant.factory.js';

export async function agentAssistantService() {
  const db = await getDb();
  const slotRepo = new SlotRepository(db);
  const bookRepo = new BookSlotRepository(db);
  const bookService = await bookSlotService();
  return agentAssistantFactory(slotRepo, bookRepo, bookService);
}
