import express from 'express';
import { getBankDetails, createBankDetails, updateBankDetails, deleteBankDetails } from '../controllers/BankController';

const router = express.Router();


// --- Bank Details Routes ---
router.get('/:adminId', getBankDetails);
router.post('/:adminId', createBankDetails);
router.put('/:id', updateBankDetails);
router.delete('/:id', deleteBankDetails)



export default router;


