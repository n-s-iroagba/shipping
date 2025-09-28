"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const controller = new paymentController_1.PaymentController();
// Create payment with receipt upload
router.post('/:stageId', upload_1.upload.single("receipt"), controller.createPayment);
router.get('/un-approved/:adminId', auth_1.authenticate, controller.listPending);
router.get('/all/:adminId', controller.listAllPayments);
// Update payment status
router.put('/:id', controller.updatePaymentStatus);
// Delete payment
router.delete('/:id', controller.deletePayment);
exports.default = router;
