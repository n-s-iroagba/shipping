"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/documentTemplateRoutes.ts
const express_1 = __importDefault(require("express"));
const documentTemplateController_1 = require("../controllers/documentTemplateController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const controller = new documentTemplateController_1.DocumentTemplateController();
// Create a new template
router.post("/:adminId", upload_1.upload.single('file'), controller.createTemplate);
// Get all templates
router.get("/all/:adminId", controller.getAllTemplates);
// Get a single template
router.get("/:id", controller.getTemplateById);
// Update template metadata
router.put("/:id", upload_1.upload.single('file'), controller.updateTemplate);
// Delete a template
router.delete("/:id", controller.deleteTemplate);
exports.default = router;
