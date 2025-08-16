import express from 'express';
import { connect } from './src/config/db.js';
import authRouter from './src/routes/authRoute.js';
import appointmentRouter from './src/routes/appointmentRoute.js';
import { authenticate } from './src/middlewares/authMiddleware.js';

const app = express();
app.use(express.json()); // parse JSON bodies

// Routes
app.get('/', (req, res) => res.send('start project now'));
app.use('/users', authRouter);
app.use('/appointment', appointmentRouter);
app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'middleware passed' });
});

// Mongo connection (only if not testing)
if (process.env.NODE_ENV !== 'test') {
  connect()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));
}

export default app; // ✅ export the app for tests