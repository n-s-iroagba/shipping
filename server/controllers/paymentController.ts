import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { Payment } from '../models/Payment';
import { PaymentService } from '../services/paymentService';
import { Shipment, ShippingStage } from '../models';
import { PaymentStatus } from '../types/payment.types';

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    const stageId = Number(req.params.stageId)
    try {
      if (!req.file) {
        throw new BadRequestError('Receipt file is required');
      }

      const { amount, } = req.body;
      const payment = await paymentService.createPayment(
stageId,
        parseFloat(amount),
      
        req?.file,
      )

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          error: error,
        });
      } else {
        console.error('Create payment error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to create payment',
        });
      }
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { status,amount,    shippingStageStatus } = req.body;

      if (!Object.values(PaymentStatus).includes(status)) {
        throw new BadRequestError('Invalid payment status');
      }

      const payment = await paymentService.updatePaymentStatus(
        parseInt(req.params.id),
        status,
        amount,
        shippingStageStatus
     
      );

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error,
        });
      } else if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          error: error,
        });
      } else {
        console.error('Update payment error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to update payment',
        });
      }
    }
  }
  async listPending(req: Request, res: Response) {
    const {adminId}= req.params
    try {
      const payments = await paymentService.getPendingPayments(Number(adminId));
      res.json( payments,
      );
    } catch (error) {
      console.error(error)
        res.status(500).json({
          success: false,
          error: 'Failed to list pending payments',
        });
    }
  }

  async listAllPayments(req:Request,res:Response){
    const {adminId} = req.params
    try{

      const payments = Payment.findAll({
      include: [
              {
                model: ShippingStage,
                 as:'paymentStage',
                include: [
                  {
                    model: Shipment,
                    as:'shipment',
                   
                    where: { adminId }, // filter by adminId
                  },
                ],
              },
            ],
      })
      res.json(payments)
    }catch(error){
      res.status(500).json({
          success: false,
          error: 'Failed to fetch payments',
        });
    }
  }
  async deletePayment(req: Request, res: Response) {
    try {
      await paymentService.deletePayment(parseInt(req.params.id));
      res.json({
        success: true,
        message: 'Payment deleted successfully',
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error,
        });
      } else {
        console.error('Delete payment error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to delete payment',
        });
      }
    }
  }
}
