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

export class PaymentService {
  private storagePath = path.join(__dirname, '../../uploads/payments');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async createPayment(
    amount: number,
    receiptFile: Express.Multer.File,
    referenceNumber?: string,
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
      // Generate unique filename
      const fileExt = path.extname(receiptFile.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(this.storagePath, fileName);

      // Save file
      await fs.promises.writeFile(filePath, receiptFile.buffer);

      // Create payment record
      const paymentData: PaymentCreationAttributes = {
        amount,
        dateAndTime: new Date(),
        status: PaymentStatus.PENDING,
        receiptPath: filePath,
        receiptType: receiptFile.mimetype,
        receiptSize: receiptFile.size,
        referenceNumber,
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
}
