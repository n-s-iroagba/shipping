import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { PaymentStatus } from '../models/Payment';
import { PaymentService } from '../services/paymentService';

const paymentService = new PaymentService();

export class PaymentController {
  // async createPayment(req: Request, res: Response) {
  //   try {
  //     if (!req.file) {
  //       throw new BadRequestError('Receipt file is required');
  //     }

  //     const { amount, referenceNumber, notes } = req.body;
  //     const payment = await paymentService.createPayment(
  //       parseFloat(amount),
  //       req.file,
  //       referenceNumber,
  //       notes
  //     );

  //     res.status(201).json({
  //       success: true,
  //       data: payment,
  //     });
  //   } catch (error) {
  //     if (error instanceof BadRequestError) {
  //       res.status(400).json({
  //         success: false,
  //         error: error,
  //       });
  //     } else {
  //       console.error('Create payment error:', error);
  //       res.status(500).json({
  //         success: false,
  //         error: 'Failed to create payment',
  //       });
  //     }
  //   }
  // }

  // async updatePaymentStatus(req: Request, res: Response) {
  //   try {
  //     const { status, notes } = req.body;

  //     if (!Object.values(PaymentStatus).includes(status)) {
  //       throw new BadRequestError('Invalid payment status');
  //     }

  //     const payment = await paymentService.updatePaymentStatus(
  //       parseInt(req.params.id),
  //       status as PaymentStatus,
  //       notes
  //     );

  //     res.json({
  //       success: true,
  //       data: payment,
  //     });
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       res.status(404).json({
  //         success: false,
  //         error: error,
  //       });
  //     } else if (error instanceof BadRequestError) {
  //       res.status(400).json({
  //         success: false,
  //         error: error,
  //       });
  //     } else {
  //       console.error('Update payment error:', error);
  //       res.status(500).json({
  //         success: false,
  //         error: 'Failed to update payment',
  //       });
  //     }
  //   }
  // }

  // async deletePayment(req: Request, res: Response) {
  //   try {
  //     await paymentService.deletePayment(parseInt(req.params.id));
  //     res.json({
  //       success: true,
  //       message: 'Payment deleted successfully',
  //     });
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       res.status(404).json({
  //         success: false,
  //         error: error,
  //       });
  //     } else {
  //       console.error('Delete payment error:', error);
  //       res.status(500).json({
  //         success: false,
  //         error: 'Failed to delete payment',
  //       });
  //     }
  //   }
  // }
}
