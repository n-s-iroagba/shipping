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
exports.DocumentTemplateController = void 0;
const errors_1 = require("../errors/errors");
const documentTemplateService_1 = require("../services/documentTemplateService");
const templateService = new documentTemplateService_1.DocumentTemplateService();
class DocumentTemplateController {
    createTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.params.adminId;
            try {
                if (!req.file) {
                    throw new errors_1.BadRequestError('No file uploaded');
                }
                const { name, description } = req.body;
                const template = yield templateService.createTemplate(Number(adminId), name, req.file, description);
                res.status(201).json({
                    success: true,
                    data: template,
                });
            }
            catch (error) {
                if (error instanceof errors_1.BadRequestError) {
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to create template',
                    });
                }
            }
        });
    }
    getAllTemplates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.params.adminId;
            try {
                const templates = yield templateService.getAllTemplates(Number(adminId));
                res.json({
                    success: true,
                    data: templates,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch templates',
                });
            }
        });
    }
    getTemplateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const template = yield templateService.getTemplateById(Number(req.params.id));
                res.json({
                    success: true,
                    data: template,
                });
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to fetch template',
                    });
                }
            }
        });
    }
    updateTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                const template = yield templateService.updateTemplate(Number(req.params.id), {
                    name,
                    description,
                });
                res.json({
                    success: true,
                    data: template,
                });
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to update template',
                    });
                }
            }
        });
    }
    deleteTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield templateService.deleteTemplate(Number(req.params.id));
                res.json({
                    success: true,
                    message: 'Template deleted successfully',
                });
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to delete template',
                    });
                }
            }
        });
    }
}
exports.DocumentTemplateController = DocumentTemplateController;
