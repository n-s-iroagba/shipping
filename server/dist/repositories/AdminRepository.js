"use strict";
// src/repositories/AdminnRepository.ts
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
const Admin_1 = __importDefault(require("../models/Admin"));
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
class AdminnRepository extends BaseRepository_1.default {
    constructor() {
        super(Admin_1.default);
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(userData);
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findById(id);
        });
    }
    findUserByResetToken(hashedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ passwordResetToken: hashedToken });
        });
    }
    findUserByVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ verificationToken: token });
        });
    }
    updateUserById(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateById(id, updates);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findAll();
            return result.data;
        });
    }
}
exports.default = new AdminnRepository();
