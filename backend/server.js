import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connect } from './src/shared/config/db.js';
import { slotIndex } from './src/features/slot/slotIndex.js';
import { bookingIndex } from './src/features/bookSlot/bookingIndex.js';

const startServer = async () => {
  try {
    const db = await connect();
    app.locals.db = db;
    await slotIndex(db); //index
    await bookingIndex(db); //index
    console.log('node environment', process.env.PORT);
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
