import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// async function runClient() {
//   const transport = new StdioClientTransport({
//     command: 'node',
//     args: ['./src/index.js'],
//     env: {
//       ...process.env,
//       PORT: '3001',
//     },
//     stderr: 'inherit', // show server startup errors in this terminal
//   });

//   const client = new Client({
//     name: 'whatsapp-agent',
//     version: '1.0.0',
//   });

//   console.log('client', client);

//   try {
//     await client.connect(transport);
//     const { tools } = await client.listTools();
//     console.log(`MCP server is reachable (${tools.length} tools)`);
//     tools.forEach((tool) => {
//       console.log(`- ${tool.name}`);
//     });
//   } catch (error) {
//     console.error('❌ Client execution error:', error);
//   } finally {
//     await transport.close().catch(() => {});
//   }
// }

// runClient();

export class WhatsAppAgentClient {
  constructor(conversationRepo, messageRepo) {
    this.conversationRepo = conversationRepo;
    this.messageRepo = messageRepo;

    this.transport = new StdioClientTransport({
      command: 'node',
      args: ['./src/index.js'],
      env: {
        ...process.env,
        PORT: '3001',
      },
      stderr: 'inherit', // show server startup errors in this terminal
    });

    this.client = new Client({
      name: 'whatsapp-agent',
      version: '1.0.0',
    });
  }

  async init() {
    await this.client.connect(this.transport);
    console.error('MCP client connected successfully');
  }

  //
  async handleIncomingPrompt(from, prompt) {
    try {
      console.log('from and prompt', from, prompt);
      await this.client.connect(this.transport);
      const { tools } = await this.client.listTools();

      const conversation =
        await this.conversationRepo.getOrCreateConversation(from);
      const convId = conversation._id;
      await this.messageRepo.createMessage({
        conversationId: convId,
        role: 'user',
        content: prompt,
      });

      console.log(`MCP server is reachable (${tools.length} tools)`);
      tools.forEach((tool) => {
        console.log(`- ${tool.name}`);
      });
    } catch (error) {
      console.error('❌ Client execution error:', error);
    } finally {
      await this.transport.close().catch(() => {});
    }
  }
}

// whatsAppAgent.handleIncomingPrompt();
