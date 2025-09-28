"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ShipmentStageController_1 = require("../controllers/ShipmentStageController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const controller = new ShipmentStageController_1.ShippingStageController();
// Type-safe async handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
// Bulk create stages with optional file upload
router.post('/bulk/:id', upload_1.upload.fields(Array.from({ length: 10 }, (_, i) => ({
    name: `supportingDocument_${i}`,
    maxCount: 1,
}))), 
// 'file' is the field name for the uploaded file
asyncHandler(controller.bulkCreateStages.bind(controller)));
// Get paginated stages with optional shipmentId filter
router.get('/all/:shipmentId', asyncHandler(controller.getStages.bind(controller)));
router.get('/:id', controller.get.bind(controller));
// Update a stage with optional file upload
router.put('/:id', upload_1.upload.single('supportingDocument'), asyncHandler(controller.updateStage.bind(controller)));
// Delete a stage
router.delete('/:id', asyncHandler(controller.deleteStage.bind(controller)));
exports.default = router;
