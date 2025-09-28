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
exports.EmailService = exports.transporter = void 0;
// EmailService.ts - Unified Email Service with best practices
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'wealthfundingtradestation@gmail.com',
        pass: 'anft vmyj ianz sftx',
    },
});
class EmailService {
    constructor(clientUrl) {
        this.clientUrl = clientUrl;
    }
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: '"Klitz Cybersecurity" <support@klitzcybersecurity.com>',
                    to: options.to,
                    subject: options.subject,
                    html: options.html,
                    text: options.text || this.stripHtml(options.html),
                    attachments: options.attachments || [],
                };
                const info = yield exports.transporter.sendMail(mailOptions);
                logger_1.default.info('Email sent successfully', {
                    messageId: info.messageId,
                    to: options.to,
                    subject: options.subject,
                    response: info.response,
                });
            }
            catch (error) {
                logger_1.default.error('Failed to send email', {
                    to: options.to,
                    subject: options.subject,
                    error: error.message,
                    stack: error.stack,
                });
                throw new Error(`Failed to send email to ${options.to}: ${error.message}`);
            }
        });
    }
    stripHtml(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    }
    // Email Templates
    getBaseEmailStyles() {
        return `
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .content { padding: 30px; }
        .button { 
          display: inline-block; 
          background: #007bff; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        .button:hover { background: #0056b3; }
        .button.danger { background: #dc3545; }
        .button.danger:hover { background: #c82333; }
        .button.success { background: #28a745; }
        .button.success:hover { background: #218838; }
        .details-box { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 20px 0;
          border-left: 4px solid #007bff;
        }
        .warning-box { 
          background: #fff3cd; 
          border: 1px solid #ffeaa7; 
          padding: 15px; 
          border-radius: 6px; 
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        .error-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          border-left: 4px solid #dc3545;
        }
        .footer { 
          background: #f8f9fa;
          padding: 20px; 
          text-align: center;
          font-size: 12px; 
          color: #666; 
          border-top: 1px solid #eee;
        }
        .text-center { text-align: center; }
        .mt-0 { margin-top: 0; }
      </style>
    `;
    }
    // Verification Email
    sendVerificationEmail(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verificationUrl = `${this.clientUrl}/verify-email/${user.verificationToken}`;
                const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Welcome ${user.username}!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Please verify your email address</p>
              </div>
              
              <div class="content">
                <p>Thank you for signing up! To complete your registration, please verify your email address.</p>
                
                <div class="details-box">
                  <h3 class="mt-0">Verification Code</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0;">${code}</p>
                  <p><em>You can also use the button below for quick verification</em></p>
                </div>
                
                <div class="text-center">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p><strong>Alternative method:</strong> Copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #007bff; background: #f8f9fa; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
                
                <div class="warning-box">
                  <strong>⚠️ Important:</strong>
                  <ul style="margin: 10px 0;">
                    <li>This verification link will expire in 24 hours</li>
                    <li>Your account will remain inactive until verified</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>If you didn't create this account, please ignore this email.</p>
                <p>&copy; ${new Date().getFullYear()} Netly Logistics. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
                yield this.sendEmail({
                    to: user.email,
                    subject: 'Verify Your Email Address - Netly Logistics',
                    html,
                });
                logger_1.default.info('Verification email sent successfully', {
                    userId: user.id,
                    email: user.email,
                });
            }
            catch (error) {
                logger_1.default.error('Failed to send verification email', {
                    userId: user.id,
                    email: user.email,
                    error: error.message,
                });
                throw new Error('Failed to send verification email');
            }
        });
    }
    // Password Reset Email
    sendPasswordResetEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetUrl = `${this.clientUrl}/auth/reset-password/${token}`;
                const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Password Reset Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure password reset for your account</p>
              </div>
              
              <div class="content">
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div class="text-center">
                  <a href="${resetUrl}" class="button danger">Reset Password</a>
                </div>
                
                <p><strong>Alternative method:</strong> Copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #dc3545; background: #f8f9fa; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                
                <div class="error-box">
                  <strong>🔒 Security Notice:</strong>
                  <ul style="margin: 10px 0;">
                    <li>This link will expire in 1 hour for security</li>
                    <li>This link can only be used once</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your current password remains unchanged until you complete the reset</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
                <p>&copy; ${new Date().getFullYear()} Netly Logistics. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
                yield this.sendEmail({
                    to: email,
                    subject: 'Password Reset Request - Netly Logistics',
                    html,
                });
                logger_1.default.info('Password reset email sent successfully', { email });
            }
            catch (error) {
                logger_1.default.error('Failed to send password reset email', {
                    email,
                    error: error.message,
                });
                throw new Error('Failed to send password reset email');
            }
        });
    }
    sendInitialiseSensitiveTrackingEmail(shipment, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${this.getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Sensitive Shipment Access</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure verification required</p>
          </div>
          
          <div class="content">
            <p>Hello ${shipment.recipientName},</p>
            <p>You have requested access to sensitive information about your shipment <strong>#${shipment.trackingNumber}</strong>.</p>
            
            <div class="details-box">
              <h3 class="mt-0">Security Verification Code</h3>
              <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0; letter-spacing: 2px;">${code}</p>
              <p><em>Use this code to access sensitive shipment details</em></p>
            </div>
            <div class="warning-box">
              <strong>🔒 Security Notice:</strong>
              <ul style="margin: 10px 0;">
                <li>This verification code will expire in 15 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>Netly Logistics will never ask for this code via phone or email</li>
              </ul>
            </div>
            
            <p><strong>Shipment Details:</strong></p>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Tracking Number:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shipment.trackingNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Recipient:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shipment.recipientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Destination:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shipment.destinationAddress}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>If you did not request access to sensitive shipment information, please ignore this email and contact our support team immediately.</p>
            <p>&copy; ${new Date().getFullYear()} Netly Logistics. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
            const subject = 'Secure Access Code for Sensitive Shipment Data';
            try {
                yield exports.transporter.sendMail({
                    from: `"Netly Logistics Security" <${process.env.EMAIL_USER}>`,
                    to: shipment.receipientEmail,
                    subject: subject,
                    html: html,
                });
                console.log(`Sensitive data access email sent to ${shipment.receipientEmail} for shipment ${shipment.trackingNumber}`);
            }
            catch (e) {
                console.error('Failed to send sensitive data access email:', e);
                throw new Error('Failed to send sensitive data access email');
            }
        });
    }
    ;
    // Generic method for custom emails
    sendCustomEmail(to, subject, html, text, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sendEmail({ to, subject, html, text, attachments });
                logger_1.default.info('Custom email sent successfully', { to, subject });
            }
            catch (error) {
                logger_1.default.error('Failed to send custom email', {
                    to,
                    subject,
                    error: error.message,
                });
                throw new Error('Failed to send custom email');
            }
        });
    }
    // Bulk email method
    sendBulkEmails(emails) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = {
                successful: 0,
                failed: [],
            };
            for (const emailOptions of emails) {
                try {
                    yield this.sendEmail(emailOptions);
                    results.successful++;
                }
                catch (error) {
                    results.failed.push({
                        email: emailOptions.to,
                        error: error.message,
                    });
                }
            }
            logger_1.default.info('Bulk email operation completed', {
                total: emails.length,
                successful: results.successful,
                failed: results.failed.length,
            });
            return results;
        });
    }
}
exports.EmailService = EmailService;
// Test email connection
//   async testConnection(): Promise<boolean> {
//     try {
//       await transporter.verify()
//       logger.info('Email service connection test passed')
//       return true
//     } catch (error: any) {
//       logger.error('Email service connection test failed', {
//         error: error.message,
//         config: {
//           host: this.config.host,
//           port: this.config.port,
//           user: this.config.auth.user,
//         },
//       })
//       return false
//     }
//   }
//   // Health check method
//   async healthCheck(): Promise<{
//     status: 'healthy' | 'unhealthy'
//     message: string
//     timestamp: Date
//   }> {
//     try {
//       const isConnected = await this.testConnection()
//       return {
//         status: isConnected ? 'healthy' : 'unhealthy',
//         message: isConnected ? 'Email service is operational' : 'Email service connection failed',
//         timestamp: new Date(),
//       }
//     } catch (error: any) {
//       return {
//         status: 'unhealthy',
//         message: `Email service error: ${error.message}`,
//         timestamp: new Date(),
//       }
//     }
//   }
// }
// Update your Payment model to include these new fields:
exports.default = new EmailService(`${process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000'}`);
