import { MessageRepository } from '../../sessionStore/messages/message.repository.js';
import { getDb } from '../../../shared/config/db.js';
import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
});

export async function finalResponseUsingLLM(
  convId,
  messages,
  toolName,
  result
) {
  // tool response pushed in the message
  //toolName : toolCalls.function.name

  const db = getDb();
  const messageRepo = new MessageRepository(db);

  messages.push({
    role: 'tool',
    tool_name: toolName,
    content: JSON.stringify(result),
  });

  const finalResponse = await ollama.chat({
    model: 'qwen3',
    messages,
    tools: [], // This turn already used its one tool call.
    think: false,
    options: { num_predict: 100 },
  });

  const answer = finalResponse.message.content ?? '';

  //   Add to the message history
  await messageRepo.createMessage({
    conversationId: convId,
    role: 'assistant',
    content: answer,
  });

  return answer;
}
