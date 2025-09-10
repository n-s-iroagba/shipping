import {
  Payment,
  PaymentStatus,
  PaymentCreationAttributes,
} from '../models/Payment';
import { NotFoundError, BadRequestError } from '../errors/errors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Transaction } from 'sequelize';
import { ShippingStage, Shipment } from '../models';

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
   
    notes?: string,
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
        notes,
      };

      payment = await Payment.create(paymentData, { transaction });

      return payment;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error('Failed to create payment');
    }
  }

  async updatePaymentStatus(
    id: number,
    status: PaymentStatus,
    notes?: string,
    transaction?: Transaction
  ): Promise<Payment> {
    // Validate status
    if (!Object.values(PaymentStatus).includes(status)) {
      throw new BadRequestError('Invalid payment status');
    }

    const payment = await Payment.findOne({
      where: { id },
      transaction,
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    try {
      payment.status = status;
      if (notes !== undefined) {
        payment.notes = notes;
      }

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
