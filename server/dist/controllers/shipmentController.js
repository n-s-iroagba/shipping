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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllAdminShipmentDetails = exports.fetchShipmentTrackingDetails = exports.fetchShipmentDetails = exports.deleteShipmentDetails = exports.editShipmentDetails = exports.createShipmentDetails = void 0;
const ShipmentDetails_1 = require("../models/ShipmentDetails");
const ShipmentStatus_1 = require("../models/ShipmentStatus");
const createShipmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId } = req.params;
    const { senderName, sendingAddress, receivingAddress, recipientName, shipmentDescription, } = req.body;
    try {
        const id = "SHP" + Date.now().toString() + Math.random().toString(36).substr(2, 4).toUpperCase();
        const shipment = yield ShipmentDetails_1.ShipmentDetails.create({
            shipmentID: id,
            senderName,
            sendingAddress,
            receivingAddress,
            recipientName,
            shipmentDescription,
            adminId: Number(adminId),
        });
        res.status(201).json({ message: "Shipment details created", shipment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating shipment", error });
    }
});
exports.createShipmentDetails = createShipmentDetails;
const editShipmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shipment = yield ShipmentDetails_1.ShipmentDetails.findByPk(id);
        if (!shipment)
            return res.status(404).json({ message: "Shipment not found" });
        yield shipment.update(req.body);
        res.json({ message: "Shipment details updated", shipment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating shipment", error });
    }
});
exports.editShipmentDetails = editShipmentDetails;
const deleteShipmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shipment = yield ShipmentDetails_1.ShipmentDetails.findByPk(id);
        if (!shipment)
            return res.status(404).json({ message: "Shipment not found" });
        yield shipment.destroy();
        res.json({ message: "Shipment details deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting shipment", error });
    }
});
exports.deleteShipmentDetails = deleteShipmentDetails;
const fetchShipmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('helloo');
    try {
        const { id } = req.params;
        const shipment = yield ShipmentDetails_1.ShipmentDetails.findByPk(id, {
            include: [
                {
                    model: ShipmentStatus_1.ShipmentStatus, // Include related shipmentStatus
                    as: "shipmentStatus", // Ensure this matches your association alias
                },
            ],
        });
        if (!shipment)
            return res.status(404).json({ message: "Shipment not found" });
        res.status(200).json(shipment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching shipment", error });
    }
});
exports.fetchShipmentDetails = fetchShipmentDetails;
const fetchShipmentTrackingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching shipment details...");
    try {
        const { trackingID } = req.params;
        const shipment = yield ShipmentDetails_1.ShipmentDetails.findOne({
            where: { shipmentID: trackingID },
            include: [
                {
                    model: ShipmentStatus_1.ShipmentStatus,
                    as: "shipmentStatus", // Ensure this alias matches your Sequelize association
                },
            ],
        });
        if (!shipment) {
            throw Error('shipment not found');
        }
        res.status(200).json(shipment);
    }
    catch (error) {
        console.error("Error fetching shipment:", error);
        res.status(500).json({ message: "Error fetching shipment", error });
    }
});
exports.fetchShipmentTrackingDetails = fetchShipmentTrackingDetails;
const fetchAllAdminShipmentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const shipments = yield ShipmentDetails_1.ShipmentDetails.findAll({
            where: {
                adminId,
            }
        });
        res.json(shipments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching shipment", error });
    }
});
exports.fetchAllAdminShipmentDetails = fetchAllAdminShipmentDetails;
