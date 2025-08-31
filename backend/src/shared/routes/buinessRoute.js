import express from 'express';
const router = express.Router();
import { authenticate } from '../middlewares/authMiddleware.js';

import { createBusiness, deleteBusiness, updateBusiness } from '../../features/business/businessController.js';
import { createBusinessOffer} from '../../features/businessOffer/businessOfferController.js';

//Business
router.post('/create', authenticate,  createBusiness);
router.delete('/delete/:id', deleteBusiness);
router.put('/update/:id', updateBusiness);


//Business offer 
router.post('/service/create', createBusinessOffer);




export default router;