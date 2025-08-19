import express from 'express';
import { connect } from './src/shared/config/db.js';
import authRouter from './src/shared/routes/authRoute.js';
import appointmentRouter from './src/shared/routes/appointmentRoute.js';
import businessRouter from './src/shared/routes/buinessRoute.js';


const app = express();
app.use(express.json()); // parse JSON bodies

// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/appointment', appointmentRouter);
app.use('/business', businessRouter);
// Mongo connection (only if not testing)
if (process.env.NODE_ENV !== 'test') {
  connect()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));
}

export default app; // ✅ export the app for tests