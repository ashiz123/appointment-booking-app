import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connect } from './src/shared/config/db.js';
import authRouter from './src/shared/routes/authRoute.js';
import businessRouter from './src/shared/routes/businessRoute.js';
import customerRouter from './src/shared/routes/customerRoutes.js'
import errorHandler from './src/shared/middlewares/errorHandlingMiddleware.js';
import { slotIndex, bookingIndex } from './src/features/slot/slotIndex.js';
dotenv.config();



const app = express();
app.use(express.json()); // parse JSON bodies
app.use(morgan("dev"));

// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/business', businessRouter);
app.use('/customer', customerRouter);

//customer error handling middleware
app.use(errorHandler);
console.log('app', process.env.NODE_ENV );
if (process.env.NODE_ENV === 'development') {
  connect()
    .then(async (db) => {
      console.log('MongoDB connected')
      await slotIndex(db);
      await bookingIndex(db);
    })
    .catch(err => console.error('MongoDB connection failed:', err));
}

export default app; // ✅ export the app for tests