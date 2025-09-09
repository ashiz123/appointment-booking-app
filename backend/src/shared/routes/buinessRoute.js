import express from 'express';
const router = express.Router();
import { authenticate } from '../middlewares/authMiddleware.js';
import { createSlotValidation } from '../../features/slot/slotValidation.js';
import { createBusinessValidation } from '../../features/business/businessValidation.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { createBusiness, deleteBusiness, updateBusiness, getBusinessByUser } from '../../features/business/businessController.js';
import { createBusinessOffer} from '../../features/businessOffer/businessOfferController.js';

import { createSlot } from '../../features/slot/slotController.js';

//Business
router.get('/byAuthUser', 
createBusinessValidation, 
validateRequest,
authenticate,
getBusinessByUser 
);

router.post('/create', authenticate,  createBusiness);
router.delete('/delete/:id', deleteBusiness);
router.put('/update/:id', updateBusiness);





//Business offer 
router.post('/service/create', createBusinessOffer);


//Generate appointment slot
router.post('/appointment_slot/create' ,
    createSlotValidation,
    validateRequest,
    createSlot
    );




export default router;