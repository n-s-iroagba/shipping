"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseUtil = void 0;
class ApiResponseUtil {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            message,
            data,
            statusCode,
        };
    }
    static error(message, statusCode = 500, error) {
        return {
            success: false,
            message,
            error,
            statusCode,
        };
    }
}
exports.ApiResponseUtil = ApiResponseUtil;
