import express from 'express';
import { verifyWebhook, receiveWebhook } from './webhook.controller.js';

const router = express.Router();

router.get('', verifyWebhook); //setting up webhook with whatsapp messaging
router.post('', receiveWebhook);

export default router;
