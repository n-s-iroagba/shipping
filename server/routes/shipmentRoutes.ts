import express, { Router } from 'express';
import { ShipmentController } from '../controllers/shipmentController';
import { validate } from '../middleware/validate';
import { shipmentSchema } from '../validation/shipment';
import { upload } from '../middleware/upload';

const router: Router = express.Router();
const controller = new ShipmentController();

// Create a new shipment with stages
router.post(
  '/:adminId',
  upload.single('supportingDocument'),
  validate(shipmentSchema),
  (req, res) => controller.createWithStages(req, res)
);

// Get all shipments
router.get('/admin/:adminId', (req, res) => controller.getAll(req, res));

// Get a specific shipment by ID
router.get('/:id', (req, res) => controller.getById(req, res));

// Update a shipment
router.put('/:id', (req, res) => controller.update(req, res));

// Delete a shipment
router.delete('/:id', (req, res) => controller.delete(req, res));

// Public tracking endpoint
router.get('/track/public/:trackingId', (req, res) =>
  controller.trackPublic(req, res)
);

// Sensitive tracking endpoint
router.get('/track/sensitive/:trackingId', (req, res) =>
  controller.trackSensitive(req, res)
);

export default router;
