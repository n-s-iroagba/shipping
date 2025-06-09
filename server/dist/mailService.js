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
exports.sendCustom = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "mail.netlylogistics.com",
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Generate stylish email template
const generateEmailTemplate = (title, message) => {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">${title}</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">${message}</p>
  </div>
  `;
};
const sendVerificationEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailContent = generateEmailTemplate("Verify Your Email", `Your verification code is: <strong>${user.verificationCode}</strong>`);
        yield transporter.sendMail({
            from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify Your Email",
            html: emailContent,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("Failed to send verification email");
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendCustom = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailContent = generateEmailTemplate(data.subject, data.message);
        yield transporter.sendMail({
            from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: data.subject,
            html: emailContent,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("Failed to send custom email");
    }
});
exports.sendCustom = sendCustom;
