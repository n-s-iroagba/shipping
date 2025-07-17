import express from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = express.Router();
const controller = new PaymentController();

// // Create payment with receipt upload
// router.post('/', controller.createPayment);

// // Update payment status
// router.patch('/:id/status', controller.updatePaymentStatus);

// // Delete payment
// router.delete('/:id', controller.deletePayment);

export default router;
