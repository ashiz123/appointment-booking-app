import { Ollama } from 'ollama';
import { buildBooking } from '../../bookSlot/bookingSlotModel.js';
import { getSystemPrompt } from '../tools/systemPrompt.js';
import { checkGreeting } from '../../../shared/utils/checkGreeting.js';
import { appointmentTools } from '../tools/appointmentTools.js';
// import { finalResponseUsingLLM } from '../tools/finalResponseUsingLLM.js';
import { createToolReply } from '../tools/toolReply.js';
import { createAppointmentTools } from '../tools/appointmentTool.factory.js';
import { hasUserDetails } from '../../../shared/utils/hasUserDetails.js';
export function agentAssistantFactory(
  slotRepo,
  messageRepo,
  conversationRepo,
  bookService
) {
  return {
    ollama: new Ollama({
      host: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
    }),

    maxToolRounds: 5,
    historyLimit: 20,
    tools: appointmentTools, //tools is here, where the arguements are set.
    executeTool: createAppointmentTools({ slotRepo, bookService }),

    async agentService(from, prompt) {
      const conversation = await conversationRepo.getOrCreateConversation(from);
      const convId = conversation._id;
      await messageRepo.createMessage({
        conversationId: convId,
        role: 'user',
        content: prompt,
      });

      //for simple hi, hello message
      if (checkGreeting(prompt)) {
        let reply =
          'Hi! I can help you check availability, book, reschedule, or cancel an appointment.';

        await messageRepo.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: reply,
        });

        return { type: 'answer', answer: reply };
      }

      const history = await messageRepo.getRecentMessages(
        convId,
        this.historyLimit
      );

      // const stateMessage = getStatePrompt(conversation);
      const systemPrompt = getSystemPrompt();
      const systemMessage = JSON.stringify(systemPrompt[0]);

      const messages = [
        { role: 'system', content: systemMessage },
        ...history.map(({ role, content }) => ({ role, content })),
      ];

      const initialResponse = await this.ollama.chat({
        model: 'qwen3',
        messages,
        tools: this.tools,
        think: false,
        options: { num_predict: 100 },
      });

      const assistantMessage = initialResponse.message;
      console.log(assistantMessage);

      const toolCalls = assistantMessage.tool_calls?.[0];

      if (!toolCalls) {
        const answer = assistantMessage.content ?? '';

        await messageRepo.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: answer,
        });

        //exit the function from here.
        return {
          type: 'answer',
          answer,
        };
      }

      const toolName = toolCalls.function.name;
      const toolArgs = toolCalls.function.arguments;
      toolArgs.phone = `+${from}`;

      console.log('tool name', toolName);
      console.log('tool args', toolArgs);

      // messages.push(assistantMessage); //its required only when you responding even with LLM.

      //Call the tool and get the response
      const result = await this.executeTool(toolName, toolArgs, from);

      //Answer manually
      const answer = createToolReply(toolName, result);

      await messageRepo.createMessage({
        conversationId: convId,
        role: 'assistant',
        content: answer,
      });

      return { type: 'answer', answer };
    },

    async fetchResponseToUser(from, response) {
      const result = await fetch(
        `https://graph.facebook.com/v26.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WABA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: from,
            type: 'text',
            text: { body: response.answer },
          }),
        }
      );

      if (!result.ok) {
        const details = await result.text();
        throw new Error(`WhatsApp send failed (${result.status}): ${details}`);
      }

      console.log('WhatsApp accepted the reply:', await result.json());
    },
  };
}
