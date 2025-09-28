"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBankDetails = exports.updateBankDetails = exports.createBankDetails = exports.getBankDetails = void 0;
const Bank_1 = __importDefault(require("../models/Bank"));
// --- Bank Details ---
const getBankDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.params.adminId;
    console.log('getBankDetails called');
    try {
        const bank = yield Bank_1.default.findOne({
            where: { adminId }
        });
        console.log('Fetched bank details count:');
        res.json(bank);
    }
    catch (err) {
        console.error('Failed to fetch bank details:', err);
        res.status(500).json({ error: 'Failed to fetch bank details', details: err });
    }
});
exports.getBankDetails = getBankDetails;
const createBankDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('createBankDetails called with body:', req.body);
    const adminId = req.params.adminId;
    try {
        const bank = yield Bank_1.default.create(Object.assign(Object.assign({}, req.body), { adminId }));
        console.log('Bank details created:', bank);
        res.status(201).json(bank);
    }
    catch (err) {
        console.error('Failed to create bank details:', err);
        res.status(500).json({ error: 'Failed to create bank details', details: err });
    }
});
exports.createBankDetails = createBankDetails;
const updateBankDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('updateBankDetails called with id:', req.params.id, 'body:', req.body);
    try {
        const bank = yield Bank_1.default.findByPk(req.params.id);
        if (!bank) {
            console.log('Bank details not found:', req.params.id);
            res.status(404).json({ error: 'Bank details not found' });
            return;
        }
        yield bank.update(req.body);
        console.log('Bank details updated:', bank);
        res.json(bank);
    }
    catch (err) {
        console.error('Failed to update bank details:', err);
        res.status(500).json({ error: 'Failed to update bank details', details: err });
    }
});
exports.updateBankDetails = updateBankDetails;
const deleteBankDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('deleteBankDetails called with id:', req.params.id);
    try {
        const bank = yield Bank_1.default.findByPk(req.params.id);
        if (!bank) {
            console.log('Bank details not found:', req.params.id);
            res.status(404).json({ error: 'Bank details not found' });
            return;
        }
        yield bank.destroy();
        console.log('Bank details deleted:', req.params.id);
        res.json({ message: 'Bank details deleted successfully' });
    }
    catch (err) {
        console.error('Failed to delete bank details:', err);
        res.status(500).json({ error: 'Failed to delete bank details', details: err });
    }
});
exports.deleteBankDetails = deleteBankDetails;
