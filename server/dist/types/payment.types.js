"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["NO_PAYMENT_REQUIRED"] = "NO_PAYMENT_REQUIRED";
    PaymentStatus["UNPAID"] = "UNPAID";
    PaymentStatus["INCOMPLETE_PAYMENT"] = "INCOMPLETE_PAYMENT";
    PaymentStatus["REJECTED"] = "REJECTED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
