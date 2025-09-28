"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = generateTrackingId;
function generateTrackingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    // Generate 10-character alphanumeric ID
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
