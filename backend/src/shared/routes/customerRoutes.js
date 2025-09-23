import express from 'express';
const router = express.Router();
import { isValidateDate } from '../middlewares/isValidateDate.js';
import { getSlotsByDate } from '../../features/slot/slotController.js';
import { booking, cancle } from '../../features/bookSlot/bookSlotController.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { bookSlotValidation } from '../../features/bookSlot/bookSlotValidation.js';



router.post('/appointment_slot/by_date',isValidateDate,  getSlotsByDate);
router.post('/book_appointment',bookSlotValidation, validateRequest,  booking );







export default router;