import { Router } from 'express';
import { cryptoWalletController } from '../controllers/cryptoWalletController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all wallet routes
router.use(authenticate);

// List wallets
router.get('/:adminId', cryptoWalletController.list);

// Create a new wallet
router.post('/:adminId', cryptoWalletController.create);

// Update a wallet
router.put('/:id', cryptoWalletController.update);

// Delete a wallet
router.delete('/:id', cryptoWalletController.remove);

export default router;
