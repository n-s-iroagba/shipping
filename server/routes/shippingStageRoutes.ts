import express, { Router } from 'express';
import { ShippingStageController } from '../controllers/ShipmentStageController';
import { upload } from '../middleware/upload';

const router: Router = express.Router();
const controller = new ShippingStageController();

// Type-safe async handler
const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Bulk create stages with optional file upload
router.post(
  '/bulk/:id',
  upload.fields(
    Array.from({ length: 10 }, (_, i) => ({
      name: `supportingDocument_${i}`,
      maxCount: 1,
    }))
  ),
  // 'file' is the field name for the uploaded file
  asyncHandler(controller.bulkCreateStages.bind(controller))
);

// Get paginated stages with optional shipmentId filter
router.get(
  '/all/:shipmentId',
  asyncHandler(controller.getStages.bind(controller))
);
router.get('/:id', controller.get.bind(controller));
// Update a stage with optional file upload
router.put(
  '/:id',
  upload.single('supportingDocument'),

  asyncHandler(controller.updateStage.bind(controller))
);

// Delete a stage
router.delete('/:id', asyncHandler(controller.deleteStage.bind(controller)));

export default router;
