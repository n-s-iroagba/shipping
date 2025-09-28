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
exports.DocumentTemplateService = void 0;
// services/DocumentTemplateService.ts
const errors_1 = require("../errors/errors");
const DocumentTemplate_1 = require("../models/DocumentTemplate");
class DocumentTemplateService {
    createTemplate(adminId, name, file, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return DocumentTemplate_1.DocumentTemplate.create({
                adminId,
                name,
                description,
                file: file,
            });
        });
    }
    getAllTemplates(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DocumentTemplate_1.DocumentTemplate.findAll({ where: { adminId } });
        });
    }
    getTemplateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield DocumentTemplate_1.DocumentTemplate.findByPk(id);
            if (!template) {
                throw new errors_1.NotFoundError('Template not found');
            }
            return template;
        });
    }
    updateTemplate(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.getTemplateById(id);
            return template.update(updates);
        });
    }
    deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.getTemplateById(id);
            yield template.destroy();
        });
    }
}
exports.DocumentTemplateService = DocumentTemplateService;
