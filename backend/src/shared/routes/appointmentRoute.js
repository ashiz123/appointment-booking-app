import express from 'express';
const router = express.Router();
import { authenticate } from '../middlewares/authMiddleware.js';

router.get('/create', authenticate, (req, res) => {
   res.status(200).json('middleware passed');
} );


export default router;