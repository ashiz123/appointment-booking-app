import express from 'express';
const router = express.Router();
// import { authenticate } from '../middlewares/authMiddleware.js';

import { createBusiness, deleteBusiness } from '../../features/business/businessController.js';
import { createBusinessOffer} from '../../features/businessOffer/businessOfferController.js';

//Business
router.post('/create', createBusiness);
router.delete('/delete/:id', deleteBusiness);


//Business offer 
router.post('/service/create', createBusinessOffer);




export default router;