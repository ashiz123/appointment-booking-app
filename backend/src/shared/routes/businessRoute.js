import express from 'express';
const router = express.Router();
import { authenticate } from '../middlewares/authMiddleware.js';
import { createSlotValidation } from '../../features/slot/slotValidation.js';
import { createBusinessValidation } from '../../features/business/businessValidation.js';
import { createBusinessOfferValidation } from '../../features/businessOffer/businessOfferValidation.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { createBusiness, deleteBusiness, updateBusiness, getBusinessByUser } from '../../features/business/businessController.js';
import { createBusinessOffer, getBusinessOffer} from '../../features/businessOffer/businessOfferController.js';
import { createSlot, getSlotsByDate } from '../../features/slot/slotController.js';
import { showBookedAppointment } from '../../features/bookSlot/bookSlotController.js';



//Business
router.post('/create', createBusinessValidation, validateRequest, authenticate, createBusiness);
router.delete('/delete/:id', authenticate,  deleteBusiness);
router.put('/update/:id',authenticate, updateBusiness);
router.get('/byAuth', authenticate, getBusinessByUser);
router.get('/offers', authenticate, getBusinessOffer);
router.post('/offer/create', createBusinessOfferValidation, validateRequest, authenticate, createBusinessOffer);


//Generate appointment slot
router.post('/appointment_slot/create' ,
    createSlotValidation,
    validateRequest,
    authenticate,
    createSlot
   );

router.get('/booked_appointment/show',authenticate,  showBookedAppointment );




export default router;