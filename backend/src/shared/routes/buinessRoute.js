import express from 'express';
const router = express.Router();
import { authenticate } from '../middlewares/authMiddleware.js';
import { createSlotValidation } from '../../features/slot/slotValidation.js';
import { createBusinessValidation } from '../../features/business/businessValidation.js';
import { createBusinessOfferValidation } from '../../features/businessOffer/businessOfferValidation.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { createBusiness, deleteBusiness, updateBusiness, getBusinessByUser } from '../../features/business/businessController.js';
import { createBusinessOffer} from '../../features/businessOffer/businessOfferController.js';

import { createSlot } from '../../features/slot/slotController.js';



//Business
router.post('/create', createBusinessValidation, validateRequest, authenticate, createBusiness);
router.delete('/delete/:id', deleteBusiness);
router.put('/update/:id', updateBusiness);
router.get('/byAuthUser', authenticate, getBusinessByUser);

//Business offer 
router.post('/service/create', createBusinessOfferValidation, validateRequest, authenticate, createBusinessOffer);


//Generate appointment slot
router.post('/appointment_slot/create' ,
    createSlotValidation,
    validateRequest,
    createSlot
    );




export default router;