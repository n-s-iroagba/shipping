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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const errors_1 = require("../errors/errors");
const validateBody = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request body:', req.body);
        // Validate the request body directly against the schema
        yield schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            console.error('Validation errors:', error);
            next(new errors_1.BadRequestError('Validation failed'));
        }
        else {
            next(error);
        }
    }
});
exports.validateBody = validateBody;
