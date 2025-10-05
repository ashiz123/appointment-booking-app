import express from 'express';
const router = express.Router();
import { isValidateDate } from '../middlewares/isValidateDate.js';
import { getSlotsByDate } from '../../features/slot/slotController.js';
import { bookingController, rescheduleController,  cancelController } from '../../features/bookSlot/bookSlotController.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { bookSlotValidation } from '../../features/bookSlot/bookSlotValidation.js';
import { rescheduleValidation } from '../../features/bookSlot/rescheduleValidation.js';
import { cancelBookingValidation } from '../../features/bookSlot/cancelBookingValidation.js';
// import { getBookingDetail } from '../../features/bookSlot/bookSlotController.js';



router.post('/appointment_slot/by_date',isValidateDate,  getSlotsByDate);
router.post('/book_appointment',bookSlotValidation, validateRequest,  bookingController );
// router.post('/booking_detail' , getBookingDetail);

router.post('/reschedule_appointment', rescheduleValidation, validateRequest, rescheduleController);
router.put('/cancel_appointment/:email', cancelBookingValidation, validateRequest, cancelController);












export default router;