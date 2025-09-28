"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = exports.AuthError = void 0;
// authError.ts
class AuthError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
// errors/NotFoundError.ts
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
// errors/BadRequestError.ts
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
