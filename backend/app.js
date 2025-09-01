import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connect } from './src/shared/config/db.js';
import {getLogger} from './src/shared/utils/logger.js';
import authRouter from './src/shared/routes/authRoute.js';
import appointmentRouter from './src/shared/routes/appointmentRoute.js';
import businessRouter from './src/shared/routes/buinessRoute.js';
import errorHandler from './src/shared/middlewares/errorHandlingMiddleware.js';
dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies
app.use(morgan("dev"));

const logger = getLogger();
logger.info('testing only');


// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/appointment', appointmentRouter);
app.use('/business', businessRouter);

//customer error handling middleware
app.use(errorHandler);
console.log('app', process.env.NODE_ENV );
if (process.env.NODE_ENV === 'development') {
  connect()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));
}

export default app; // ✅ export the app for tests