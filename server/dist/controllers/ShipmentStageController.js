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
exports.ShippingStageController = void 0;
const ShippingStageService_1 = require("../services/ShippingStageService");
const fs_1 = __importDefault(require("fs"));
class ShippingStageController {
    constructor() {
        this.service = new ShippingStageService_1.ShippingStageService();
    }
    bulkCreateStages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (!req.body) {
                    return res.status(400).json({ message: 'Stages array is required' });
                }
                const parsedStages = req.body.stages.map((stage) => JSON.parse(stage)); // stringified array of stage objects
                console.log(parsedStages);
                if (!Array.isArray(parsedStages)) {
                    return res.status(400).json({ message: 'Stages should be an array' });
                }
                const files = req.files;
                const stagesData = parsedStages.map((stage, index) => {
                    var _a;
                    const fileKey = `supportingDocument_${index}`;
                    const file = (_a = files === null || files === void 0 ? void 0 : files[fileKey]) === null || _a === void 0 ? void 0 : _a[0];
                    const fileBuffer = file ? fs_1.default.readFileSync(file.path) : null;
                    if (file)
                        fs_1.default.unlinkSync(file.path);
                    return Object.assign(Object.assign({}, stage), { shipmentId: Number(id), supportingDocument: fileBuffer });
                });
                const createdStages = yield this.service.bulkCreate(stagesData);
                res.status(201).json(createdStages);
            }
            catch (error) {
                console.error('Bulk create error:', error);
                res.status(500).json({ error: error.message || 'Server error' });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const stages = yield this.service.get(Number(id));
                res.json(stages);
            }
            catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }
    getStages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { shipmentId } = req.params;
            console.log('SHHHHHH', shipmentId);
            try {
                const { page = 1, limit = 10 } = req.query;
                const stages = yield this.service.getPaginated(Number(page), Number(limit), shipmentId);
                res.json(stages);
            }
            catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }
    updateStage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stageId = req.params.id;
                const stageData = req.body;
                if (req.file) {
                    stageData.supportingDocument = req.file.path;
                }
                const updatedStage = yield this.service.update(stageId, stageData);
                console.log(updatedStage);
                res.json(updatedStage);
            }
            catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }
    deleteStage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stageId = req.params.id;
                yield this.service.delete(stageId);
                res.status(204).send();
            }
            catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        });
    }
}
exports.ShippingStageController = ShippingStageController;
