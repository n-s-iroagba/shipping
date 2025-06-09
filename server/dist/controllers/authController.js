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
exports.login = exports.verifyEmail = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const mailService_1 = require("../mailService");
dotenv_1.default.config();
const JWT_SECRET = 'udorakpuenyi';
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield User_1.User.findOne({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield User_1.User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        });
        const verificationToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        newUser.verificationCode = String(verificationCode);
        newUser.verificationToken = verificationToken;
        yield newUser.save();
        yield (0, mailService_1.sendVerificationEmail)(newUser);
        res.status(201).json(verificationToken);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.signUp = signUp;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, code } = req.body;
        console.log('verifying email');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield User_1.User.findByPk(decoded.userId);
        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });
        user.isVerified = true;
        yield user.save();
        const loginToken = jsonwebtoken_1.default.sign({ adminId: user.id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json(loginToken);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid token" });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        if (!user.isVerified)
            return res
                .status(400)
                .json({ message: "Please verify your email first" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ adminId: user.id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json(token);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.login = login;
