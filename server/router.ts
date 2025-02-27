import express from "express";
import { signUp, verifyEmail, login } from "./controllers/authController";
import { createShipmentDetails, editShipmentDetails, deleteShipmentDetails, fetchShipmentDetails } from "./controllers/shipmentController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.post("/shipments", createShipmentDetails);
router.put("/shipments/:shipmentDetailsId", editShipmentDetails);
router.delete("/shipments/:shipmentDetailsId", deleteShipmentDetails);
router.get("/shipments/:shipmentDetailsId", fetchShipmentDetails);

export default router;
