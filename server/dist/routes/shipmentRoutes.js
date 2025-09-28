"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipmentController_1 = require("../controllers/shipmentController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const controller = new shipmentController_1.ShipmentController();
// Create a new shipment with stages
router.post('/:adminId', upload_1.upload.any(), 
// validateBody(shipmentSchema),
(req, res) => controller.createWithStages(req, res));
router.post('/mail', controller.sendMail);
// Get all shipments
router.get('/admin/:adminId', (req, res) => controller.getAll(req, res));
// Get a specific shipment by ID
router.get('/:id', (req, res) => controller.getById(req, res));
// Update a shipment
router.put('/:id', (req, res) => controller.update(req, res));
// Delete a shipment
router.delete('/:id', (req, res) => controller.delete(req, res));
// Public tracking endpoint
router.get('/track/public/:trackingId', (req, res) => controller.trackPublic(req, res));
// Sensitive tracking endpoint
// router.get('/track/sensitive/:trackingId', (req, res) =>
//   controller.trackSensitive(req, res)
// );
router.get('/initiate/:shipmentId', controller.initiateSensitiveTracking);
router.post('/sensitive/access', controller.grantsSensitiveView);
exports.default = router;
