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
exports.deleteShipmentStatus = exports.updateShipmentStatus = exports.createShipmentStatus = void 0;
const ShipmentDetails_1 = require("../models/ShipmentDetails");
const ShipmentStatus_1 = require("../models/ShipmentStatus");
const createShipmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shipmentId } = req.params;
        const data = Object.assign({}, req.body);
        console.log('=== DEBUG INFO ===');
        console.log('shipmentId:', shipmentId);
        console.log('req.body:', data);
        console.log('==================');
        // Validate required fields
        if (!data.title || !data.location || !data.carrierNote || !data.dateAndTime || !data.longitude || !data.latitude) {
            console.log('Missing required fields:');
            console.log('title:', !!data.title);
            console.log('location:', !!data.location);
            console.log('carrierNote:', !!data.carrierNote);
            console.log('dateAndTime:', !!data.dateAndTime);
            console.log('longitude:', !!data.longitude);
            console.log(' latitude:', !!data.latitude);
            throw new Error("Title, location, carrier note, and date/time are required lat and longitude required");
        }
        const shipment = yield ShipmentDetails_1.ShipmentDetails.findOne({ where: { id: shipmentId } });
        if (!shipment) {
            console.log('Shipment not found for ID:', shipmentId);
            throw new Error("Shipment not found");
        }
        console.log('Shipment found:', shipment.id);
        // Convert string values to proper types
        const stageData = {
            title: data.title,
            location: data.location,
            carrierNote: data.carrierNote,
            dateAndTime: new Date(data.dateAndTime),
            paymentStatus: data.paymentStatus || "",
            feeInDollars: data.feeInDollars ? Number.parseFloat(data.feeInDollars) : null,
            percentageNote: data.percentageNote || null,
            longitude: data.longitude,
            latitude: data.latitude,
            shipmentDetailsId: Number.parseInt(shipmentId),
        };
        // Add validation for shipmentDetailsId
        if (isNaN(stageData.shipmentDetailsId)) {
            throw new Error('Invalid shipment ID');
        }
        // Validate dateAndTime
        if (isNaN(stageData.dateAndTime.getTime())) {
            throw new Error('Invalid date format');
        }
        console.log('About to create ShipmentStatus...');
        const stage = yield ShipmentStatus_1.ShipmentStatus.create(stageData);
        console.log('Successfully created stage:', stage.id);
        res.status(201).json(stage);
    }
    catch (error) {
        console.error('Error in createStatus:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            message: "Error creating shipping stage",
            error: error.message // Include error message for debugging
        });
    }
});
exports.createShipmentStatus = createShipmentStatus;
const updateShipmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stageId } = req.params;
        const file = req.file;
        const data = Object.assign({}, req.body);
        const stage = yield ShipmentStatus_1.ShipmentStatus.findByPk(stageId);
        if (!stage) {
            return res.status(404).json({ message: "Shipping stage not found" });
        }
        // Handle file upload if present - store as blob
        if (file) {
            data.supportingDocument = file.buffer.toString("base64");
        }
        // Convert and validate data types
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.location)
            updateData.location = data.location;
        if (data.carrierNote)
            updateData.carrierNote = data.carrierNote;
        if (data.dateAndTime)
            updateData.dateAndTime = new Date(data.dateAndTime);
        if (data.paymentStatus)
            updateData.paymentStatus = data.paymentStatus;
        if (data.feeInDollars !== undefined)
            updateData.feeInDollars = data.feeInDollars ? Number.parseFloat(data.feeInDollars) : null;
        if (data.percentageNote !== undefined)
            updateData.percentageNote = data.percentageNote || null;
        if (data.amountPaid !== undefined)
            updateData.amountPaid = data.amountPaid ? Number.parseFloat(data.amountPaid) : null;
        if (data.paymentDate)
            updateData.paymentDate = new Date(data.paymentDate);
        yield stage.update(updateData);
        const updatedStatus = yield ShipmentStatus_1.ShipmentStatus.findByPk(stageId);
        res.json(updatedStatus);
    }
    catch (error) {
        console.error("Error updating shipment stage:", error);
        return res.status(500).json({ message: "Error updating shipping stage" });
    }
});
exports.updateShipmentStatus = updateShipmentStatus;
const deleteShipmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const statusInUse = yield ShipmentStatus_1.ShipmentStatus.findByPk(id);
        if (!statusInUse) {
            return res.status(404).json({ message: "ShipmentStatus not found" });
        }
        yield statusInUse.destroy();
        return res.status(200).json({ message: "ShipmentStatus deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting statusInUse:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteShipmentStatus = deleteShipmentStatus;
