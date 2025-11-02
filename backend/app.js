import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectRedis } from './src/shared/config/redisClient.js';
import authRouter from './src/shared/routes/authRoute.js';
import businessRouter from './src/shared/routes/businessRoute.js';
import customerRouter from './src/shared/routes/customerRoutes.js'
import errorHandler from './src/shared/middlewares/errorHandlingMiddleware.js';

dotenv.config();
const app = express();
app.use(express.json()); //parse JSON bodies
app.use(morgan("dev"));


(async() => {
        await connectRedis();
    })();

    
// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/business', businessRouter);
app.use('/customer', customerRouter);




//customer error handling middleware
app.use(errorHandler);


export default app; // ✅ export the app for tests p