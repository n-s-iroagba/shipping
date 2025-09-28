"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
// logger.ts
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf((_a) => {
        var { level, message, timestamp } = _a, meta = __rest(_a, ["level", "message", "timestamp"]);
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
const logError = (message, error, context) => {
    var _a;
    logger.error(message, Object.assign({ message: error.message, stack: error.stack, response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data }, context));
};
exports.logError = logError;
exports.default = logger;
