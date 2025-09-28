"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUrl = exports.dbConfig = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables based on NODE_ENV
exports.env = process.env.NODE_ENV || 'development';
const envPath = path_1.default.resolve(__dirname, `../.env.${exports.env}`);
dotenv_1.default.config({ path: envPath });
exports.dbConfig = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.SSL_MODE === 'REQUIRED',
};
exports.ClientUrl = process.env.CLIENT_URL;
