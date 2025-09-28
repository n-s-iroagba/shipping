import {
  Payment,

  PaymentCreationAttributes,
} from '../models/Payment';
import { NotFoundError, BadRequestError } from '../errors/errors';

import path from 'path';
import fs from 'fs';
import { Transaction } from 'sequelize';
import { ShippingStage, Shipment } from '../models';
import { PaymentStatus, ShippingStagePaymentStatus } from '../types/payment.types';


export class PaymentService {
  private storagePath = path.join(__dirname, '../../uploads/payments');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async createPayment(
    stageId:number,
    amount: number,
    receiptFile:any,
    transaction?: Transaction
  ): Promise<Payment> {
    if (!receiptFile) {
      throw new BadRequestError('Receipt file is required');
    }

    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    let payment: Payment;
    try {
   

      

      // Create payment record
      const paymentData: PaymentCreationAttributes = {
        amount,
        shippingStageId:stageId,
        dateAndTime: new Date(),
        status: PaymentStatus.PENDING,
        receipt: receiptFile,
      };

      payment = await Payment.create(paymentData, { transaction });
      const stage = await ShippingStage.findByPk(stageId)
      if(!stage){
        throw new NotFoundError('stage not found')
      }
      stage.paymentStatus=ShippingStagePaymentStatus.PENDING

      await stage.save()
      return payment;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error('Failed to create payment');
    }
  }

  async updatePaymentStatus(
    id: number,
    status: PaymentStatus,
    amount:number,
    shippingStageStatus:ShippingStagePaymentStatus,
    transaction?: Transaction

  ): Promise<Payment> {
    // Validate status
    if (!Object.values(PaymentStatus).includes(status)) {
      throw new BadRequestError('Invalid payment status');
    }
    console.log('amount',amount)

 

    try {
      
    const payment = await Payment.findOne({
      where: { id },
      transaction,
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    const stage = await ShippingStage.findOne({
      where:{
        id:payment.shippingStageId
      }
    })
      if (!stage) {
      throw new NotFoundError('stage not found');

    }
  payment.amount = payment.amount
  payment.status =status
stage.amountPaid = (stage.amountPaid || 0) + amount;
stage.paymentStatus = shippingStageStatus

    await stage.save()
      await payment.save({ transaction });
      return payment;
    } catch (error) {
      console.error('Payment status update failed:', error);
      throw new Error('Failed to update payment status');
    }
  }

  async deletePayment(id: number, transaction?: Transaction): Promise<void> {
    const payment = await Payment.findOne({
      where: { id },
      transaction,
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    try {
      // Delete will automatically trigger the beforeDestroy hook
      await payment.destroy({ transaction });
    } catch (error) {
      console.error('Payment deletion failed:', error);
      throw new Error('Failed to delete payment');
    }
  }

  async getPaymentById(
    id: number,
    transaction?: Transaction
  ): Promise<Payment | null> {
    return await Payment.findOne({
      where: { id },
      transaction,
    });
  }

  async getAllPayments(transaction?: Transaction): Promise<Payment[]> {
    return await Payment.findAll({
      order: [['dateAndTime', 'DESC']],
      transaction,
    });
  }

    async getPendingPayments(
    adminId: number,
    transaction?: Transaction
  ): Promise<Payment[]> {
    return await Payment.findAll({
      where: { status: PaymentStatus.PENDING },
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
      order: [['dateAndTime', 'DESC']],
      transaction,
    });
  }
}
