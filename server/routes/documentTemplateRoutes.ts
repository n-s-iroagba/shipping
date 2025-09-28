// routes/documentTemplateRoutes.ts
import express from 'express';
import { DocumentTemplateController } from '../controllers/documentTemplateController';
import { upload } from '../middleware/upload';

const router = express.Router();
const controller = new DocumentTemplateController();

// Create a new template
router.post("/:adminId", upload.single('file'), controller.createTemplate);

// Get all templates
router.get("/all/:adminId", controller.getAllTemplates);

// Get a single template
router.get("/:id", controller.getTemplateById);

// Update template metadata
router.put("/:id", upload.single('file'),  controller.updateTemplate);



// Delete a template
router.delete("/:id", controller.deleteTemplate);

export default router;
