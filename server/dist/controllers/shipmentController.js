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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const errors_1 = require("../errors/errors");
const shipmentService_1 = require("../services/shipmentService");
const fs_1 = __importDefault(require("fs"));
const EmailService_1 = __importDefault(require("../services/EmailService"));
const service = new shipmentService_1.ShipmentService();
class ShipmentController {
    createWithStages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId } = req.params;
            try {
                const _a = req.body, { shippingStages } = _a, rest = __rest(_a, ["shippingStages"]);
                console.log('rest is', rest);
                const files = req.files;
                const stagesData = shippingStages.map((stage, index) => {
                    var _a;
                    const fileKey = `supportingDocument_${index}`;
                    const file = (_a = files === null || files === void 0 ? void 0 : files[fileKey]) === null || _a === void 0 ? void 0 : _a[0];
                    const fileBuffer = file ? fs_1.default.readFileSync(file.path) : null;
                    if (file)
                        fs_1.default.unlinkSync(file.path);
                    return Object.assign(Object.assign({}, stage), { supportingDocument: fileBuffer });
                });
                const shipment = yield service.createWithStages(Object.assign(Object.assign({}, rest), { adminId }), stagesData);
                res.status(201).json(shipment);
                return;
            }
            catch (error) {
                console.error(error);
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json(error);
                }
                else {
                    res.status(500).json({ error: 'Failed to create shipment' });
                }
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId } = req.params;
            try {
                const shipments = yield service.getAll(adminId);
                res.json(shipments);
                return;
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch shipments' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shipment = yield service.getById(Number(req.params.id));
                console.log('shipment', shipment);
                return res.status(200).json(shipment);
            }
            catch (error) {
                console.error(error);
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json(error);
                }
                else {
                    res.status(500).json({ error: 'Failed to fetch shipment' });
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedShipment = yield service.update(Number(req.params.id), req.body);
                res.json(updatedShipment);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json(error);
                }
                else {
                    res.status(500).json({ error: 'Failed to update shipment' });
                }
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service.delete(Number(req.params.id));
                res.json(result);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json(error);
                }
                else {
                    res.status(500).json({ error: 'Failed to delete shipment' });
                }
            }
        });
    }
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subject, content, email } = req.body;
            try {
                EmailService_1.default.sendCustomEmail(email, subject, content);
                res.json();
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to send mail' });
            }
        });
    }
    trackPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trackingInfo = yield service.getSensitiveTrackingInfo(req.params.trackingId);
                res.json(trackingInfo);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json(error);
                }
                else {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to track shipment' });
                }
            }
        });
    }
    initiateSensitiveTracking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipmentId = req.params.shipmentId;
            try {
                const token = yield service.initiateSensitiveTracking(shipmentId);
                res.json(token);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed initiate shipment tracking' });
            }
        });
    }
    grantsSensitiveView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield service.issueSenstiveViewToken(req.body);
                res.json(token);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed initiate shipment tracking' });
            }
        });
    }
}
exports.ShipmentController = ShipmentController;
