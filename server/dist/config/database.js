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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const _1 = require(".");
// Initialize Sequelize
exports.sequelize = new sequelize_1.Sequelize(_1.dbConfig.database, _1.dbConfig.username, _1.dbConfig.password, {
    host: _1.dbConfig.host,
    dialect: 'mysql',
    port: _1.dbConfig.port,
    logging: _1.dbConfig.logging ? console.log : false,
});
// Test database connection and initialize models
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (force = false) {
    try {
        yield exports.sequelize.authenticate();
        console.log(`✅ ${_1.env} Database connected successfully!`);
        // Import models to ensure they are initialized with associations
        yield Promise.resolve().then(() => __importStar(require('../models/init')));
        // Sync database
        yield exports.sequelize
            .sync({ force: force })
            .then(() => console.log('✅ Tables formed with associations'));
    }
    catch (error) {
        console.error(`❌ Unable to connect to the ${_1.env} database:`, error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
