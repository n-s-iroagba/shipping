"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankController_1 = require("../controllers/BankController");
const router = express_1.default.Router();
// --- Bank Details Routes ---
router.get('/:adminId', BankController_1.getBankDetails);
router.post('/:adminId', BankController_1.createBankDetails);
router.put('/:id', BankController_1.updateBankDetails);
router.delete('/:id', BankController_1.deleteBankDetails);
exports.default = router;
