import express from 'express';
import morgan from 'morgan';
import { connectRedis } from './shared/config/redisClient.js';
import authRouter from './shared/routes/authRoute.js';
import businessRouter from './shared/routes/businessRoute.js';
import customerRouter from './shared/routes/customerRoutes.js';
import webhookRouter from './features/webhook/webhook.route.js';
import errorHandler from './shared/middlewares/errorHandlingMiddleware.js';

const app = express();
app.use(express.json()); //parse JSON bodies
app.use(morgan('dev'));

(async () => {
  await connectRedis();
})();

// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/business', businessRouter);
app.use('/appointments', customerRouter);
app.use('/webhook', webhookRouter);

//customer error handling middleware
app.use(errorHandler);

export default app; // ✅ export the app for tests p
