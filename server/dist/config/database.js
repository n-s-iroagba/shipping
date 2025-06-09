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
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Sequelize instance for MySQL
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'shipping', // Database name
process.env.DB_USER || 'root', // Database user
process.env.DB_PASS || '97chocho', // Database password
{
    host: process.env.DB_HOST, // Database host
    dialect: "mysql",
    logging: false, // Set to true for SQL logging
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
// Test database connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log("✅ MySQL Database connected successfully!");
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
});
exports.connectDB = connectDB;
