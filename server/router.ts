import express from "express";
import { signUp, verifyEmail, login } from "./controllers/authController";
import { createShipmentDetails, editShipmentDetails, deleteShipmentDetails, fetchShipmentDetails, fetchAllAdminShipmentDetails } from "./controllers/shipmentController";
import { createStep, deleteStep, updateStep } from "./controllers/StepsController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.post("/shipments/admin/:adminId", createShipmentDetails);
router.put("/shipments/:id", editShipmentDetails);
router.delete("/shipments/:id", deleteShipmentDetails);
router.get("/shipments/:id", fetchShipmentDetails);
router.get("/shipments/admin/:adminId", fetchAllAdminShipmentDetails);


router.post("/steps/:shipmentDetailsId", createStep);
router.put("/steps/:id", updateStep)
router.delete("/steps/:id", deleteStep);

export default router;
