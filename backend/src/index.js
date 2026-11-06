import 'dotenv/config';
import app from './app.js';
import { connect } from './shared/config/db.js';
import { slotIndex } from './features/slot/slotIndex.js';
import { bookingIndex } from './features/bookSlot/bookingIndex.js';
import { createMCPServer } from './mcpServer.js';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { whatsAppAgentService } from './mcpClient.service.js';
// const startServer = async () => {
//   try {
//     const db = await connect();
//     app.locals.db = db;
//     await slotIndex(db); //index
//     await bookingIndex(db); //index
//     console.log('node environment', process.env.PORT);
//     const port = process.env.PORT || 3000;
//     app.listen(port, () => console.log(`Server running on port ${port}`));
//   } catch (err) {
//     console.error('Failed to start server:', err);
//   }
// };

const startServer = async () => {
  try {
    const db = await connect();
    app.locals.db = db;

    await slotIndex(db);
    await bookingIndex(db);

    app.locals.whatsAppAgent = await whatsAppAgentService();

    console.error(`Node environment: ${process.env.PORT || 'default'}`);
    const port = process.env.PORT || 3000;

    // MUST use console.error here so it doesn't pollute stdout for the MCP transport
    app.listen(port, () => console.error(`Server running on port ${port}`));

    const server = await createMCPServer();

    // Connect via stdio (all logs must go to stderr, NEVER stdout!)
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('MCP Server running on stdio');
  } catch (err) {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
  }
};

startServer();
