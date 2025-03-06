import express from "express";
import { signUp, verifyEmail, login } from "./controllers/authController";
import { createShipmentDetails, editShipmentDetails, deleteShipmentDetails, fetchShipmentDetails, fetchAllAdminShipmentDetails, fetchShipmentTrackingDetails } from "./controllers/shipmentController";
import { createShipmentStatus, deleteShipmentStatus, updateShipmentStatus } from "./controllers/ShipmentStatusController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.post("/shipments/admin/:adminId", createShipmentDetails);
router.put("/shipments/:id", editShipmentDetails);
router.delete("/shipments/:id", deleteShipmentDetails);
router.get("/shipments/tracking/:trackingID", fetchShipmentTrackingDetails);
router.get("/shipments/:id", fetchShipmentDetails);
router.get("/shipments/admin/:adminId", fetchAllAdminShipmentDetails);


router.post("/shipmentStatus/:shipmentDetailsId", createShipmentStatus);
router.put("/shipmentStatus/:id", updateShipmentStatus)
router.delete("/shipmentStatus/:id", deleteShipmentStatus);

export default router;
