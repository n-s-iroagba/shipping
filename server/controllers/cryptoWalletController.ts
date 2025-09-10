import { Response, Request } from 'express';
import { CryptoWallet } from '../models/CryptoWallet';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

// Unified error handler using plain Error
function handleError(error: unknown, context: string, res: Response) {
  let message = 'Internal server error';

  if (error instanceof Error) {
    message = error.message;
  }

  logger.error(`Failed to ${context}: ${message}`);
  res.status(400).json({
    success: false,
    message,
  });
}

export const cryptoWalletController = {
  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req?.user?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!adminId) {
        throw new Error('Valid admin ID is required');
      }

      const offset = (Number(page) - 1) * Number(limit);

      const wallets = await CryptoWallet.findAll({
        where: { adminId },
      });

      logger.info(`Listed ${wallets.length} crypto wallets for admin ${adminId}`);
      res.json(wallets);
    } catch (error) {
      handleError(error, 'list crypto wallets', res);
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = Number(req?.params.adminId);

      if (!adminId) {
        throw new Error('Valid admin ID is required');
      }

      const { currency, walletAddress } = req.body;

      const wallet = await CryptoWallet.create({
        adminId,
        currency,
        walletAddress,
      });

      logger.info(`Crypto wallet created successfully for admin ${adminId}`);
      res.status(201).json({
        success: true,
        message: 'Crypto wallet created successfully',
        data: wallet,
      });
    } catch (error) {
      handleError(error, 'create crypto wallet', res);
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req?.user?.id;

      if (!adminId) {
        throw new Error('Valid admin ID is required');
      }

      if (!id || isNaN(Number(id))) {
        throw new Error('Valid wallet ID is required');
      }

      // Example: validate request body
      // validateCryptoWalletUpdate(req.body);

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new Error('Crypto wallet not found');
      }

      if (wallet.adminId !== adminId) {
        throw new Error('Not authorized to update this wallet');
      }

      await wallet.update(req.body);
      const updatedWallet = await CryptoWallet.findByPk(id);

      if (!updatedWallet) {
        throw new Error('Failed to retrieve updated wallet');
      }

      logger.info(`Crypto wallet updated successfully: ${id}`);
      res.json({
        success: true,
        message: 'Crypto wallet updated successfully',
        data: updatedWallet,
      });
    } catch (error) {
      handleError(error, 'update crypto wallet', res);
    }
  },

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req?.user?.id;

      if (!adminId) {
        throw new Error('Valid admin ID is required');
      }

      if (!id || isNaN(Number(id))) {
        throw new Error('Valid wallet ID is required');
      }

      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new Error('Crypto wallet not found');
      }

      if (wallet.adminId !== adminId) {
        throw new Error('Not authorized to delete this wallet');
      }

      await wallet.destroy();

      logger.info(`Crypto wallet deleted successfully: ${id}`);
      res.json({
        success: true,
        message: 'Crypto wallet deleted successfully',
      });
    } catch (error) {
      handleError(error, 'delete crypto wallet', res);
    }
  },
};
