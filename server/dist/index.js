"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const shipmentRoutes_1 = __importDefault(require("./routes/shipmentRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const shippingStageRoutes_1 = __importDefault(require("./routes/shippingStageRoutes"));
const cryptoWalletRoutes_1 = __importDefault(require("./routes/cryptoWalletRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const documentTemplateRoutes_1 = __importDefault(require("./routes/documentTemplateRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const bankRoutes_1 = __importDefault(require("./routes/bankRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, express_1.urlencoded)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL || 'https://www.netlylogistics.com'
        : 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.path}`);
    console.log('📦 Body:', req.body);
    next();
});
// connectDB(true);
// sequelize.sync({ alter: true });
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/crypto-wallet', cryptoWalletRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/stage', shippingStageRoutes_1.default);
app.use('/api/shipment', shipmentRoutes_1.default);
app.use('/api/templates', documentTemplateRoutes_1.default);
app.use('/bank', bankRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
