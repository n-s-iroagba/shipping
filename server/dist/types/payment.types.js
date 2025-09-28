"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.ShippingStagePaymentStatus = void 0;
var ShippingStagePaymentStatus;
(function (ShippingStagePaymentStatus) {
    ShippingStagePaymentStatus["PENDING"] = "PENDING";
    ShippingStagePaymentStatus["PAID"] = "PAID";
    ShippingStagePaymentStatus["NO_PAYMENT_REQUIRED"] = "NO_PAYMENT_REQUIRED";
    ShippingStagePaymentStatus["UNPAID"] = "UNPAID";
    ShippingStagePaymentStatus["INCOMPLETE_PAYMENT"] = "INCOMPLETE_PAYMENT";
    ShippingStagePaymentStatus["REJECTED"] = "REJECTED";
})(ShippingStagePaymentStatus || (exports.ShippingStagePaymentStatus = ShippingStagePaymentStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["REJECTED"] = "REJECTED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
