import express from 'express';
const router = express.Router();
import { isValidDate } from '../middlewares/isValidDate.js';
import { getSlotsByDate } from '../../features/slot/slotController.js';
import {
  bookingController,
  rescheduleController,
  cancelController,
} from '../../features/bookSlot/bookSlotController.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { bookSlotValidation } from '../../features/bookSlot/bookSlotValidation.js';
import { rescheduleValidation } from '../../features/bookSlot/rescheduleValidation.js';
import { cancelBookingValidation } from '../../features/bookSlot/cancelBookingValidation.js';
import { requestToAgent } from '../../features/agents/agent.controller.js';
// import { getBookingDetail } from '../../features/bookSlot/bookSlotController.js';

router.post('/agent', requestToAgent);

router.get('/slots', isValidDate, getSlotsByDate);

// router.post('/booking_detail' , getBookingDetail);
router.post('/booking', bookSlotValidation, validateRequest, bookingController);

router.post(
  '/reschedule',
  rescheduleValidation,
  validateRequest,
  rescheduleController
);

//one email may have other booking, its better to use booking id to cancel the appointment
router.put(
  '/cancel/:email',
  cancelBookingValidation,
  validateRequest,
  cancelController
);

// router.patch(
//   '/bookings/:bookingId/cancellation',
//   cancelBookingValidation,
//   validateRequest,
//   cancelController
// )

export default router;
