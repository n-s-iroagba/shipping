"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cryptoWalletController_1 = require("../controllers/cryptoWalletController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication middleware to all wallet routes
router.use(auth_1.authenticate);
// List wallets
router.get('/:adminId', cryptoWalletController_1.cryptoWalletController.list);
// Create a new wallet
router.post('/:adminId', cryptoWalletController_1.cryptoWalletController.create);
// Update a wallet
router.put('/:id', cryptoWalletController_1.cryptoWalletController.update);
// Delete a wallet
router.delete('/:id', cryptoWalletController_1.cryptoWalletController.remove);
exports.default = router;
