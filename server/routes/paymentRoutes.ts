import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const controller = new PaymentController();

// Create payment with receipt upload
router.post('/', controller.createPayment);
router.get('/un-approved/:adminId',authenticate, controller.listPending)
router.get('/all/:adminId', controller.listAllPayments)
// Update payment status
router.patch('/:id/status', controller.updatePaymentStatus);

// Delete payment
router.delete('/:id', controller.deletePayment);

export default router;
