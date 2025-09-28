import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();
const controller = new PaymentController();

// Create payment with receipt upload
router.post('/:stageId', upload.single("receipt"), controller.createPayment);
router.get('/un-approved/:adminId',authenticate, controller.listPending)
router.get('/all/:adminId', controller.listAllPayments)
// Update payment status
router.put('/:id', controller.updatePaymentStatus);

// Delete payment
router.delete('/:id', controller.deletePayment);

export default router;
