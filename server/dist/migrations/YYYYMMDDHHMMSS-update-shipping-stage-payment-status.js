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
exports.up = up;
exports.down = down;
// migrations/YYYYMMDDHHMMSS-update-shipping-stage-payment-status.ts
const sequelize_1 = require("sequelize");
function up(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        // Step 1: Add a temporary column with the new enum
        yield queryInterface.addColumn('ShippingStages', 'temp_payment_status', {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED'),
            allowNull: true,
        });
        // Step 2: Copy data from old column to new column, mapping values as needed
        yield queryInterface.sequelize.query(`
    UPDATE "ShippingStages" 
    SET temp_payment_status = 
      CASE 
        WHEN payment_status = 'PENDING' THEN 'PENDING'
        WHEN payment_status = 'PAID' THEN 'PAID'
        WHEN payment_status = 'NO_PAYMENT_REQUIRED' THEN 'NO_PAYMENT_REQUIRED'
        WHEN payment_status = 'UNPAID' THEN 'UNPAID'
        WHEN payment_status = 'INCOMPLETE_PAYMENT' THEN 'INCOMPLETE_PAYMENT'
        ELSE 'PENDING'  -- Default fallback
      END
  `);
        // Step 3: Drop the old column
        yield queryInterface.removeColumn('ShippingStages', 'payment_status');
        // Step 4: Rename the temporary column to the original name
        yield queryInterface.renameColumn('ShippingStages', 'temp_payment_status', 'payment_status');
        // Step 5: Make the column non-nullable if it was before
        yield queryInterface.changeColumn('ShippingStages', 'payment_status', {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED'),
            allowNull: false,
            defaultValue: 'PENDING',
        });
    });
}
function down(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        // Reverse the migration - go back to the old enum
        yield queryInterface.addColumn('ShippingStages', 'temp_payment_status', {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT'),
            allowNull: true,
        });
        // Copy data back, excluding REJECTED status
        yield queryInterface.sequelize.query(`
    UPDATE "ShippingStages" 
    SET temp_payment_status = 
      CASE 
        WHEN payment_status = 'PENDING' THEN 'PENDING'
        WHEN payment_status = 'PAID' THEN 'PAID'
        WHEN payment_status = 'NO_PAYMENT_REQUIRED' THEN 'NO_PAYMENT_REQUIRED'
        WHEN payment_status = 'UNPAID' THEN 'UNPAID'
        WHEN payment_status = 'INCOMPLETE_PAYMENT' THEN 'INCOMPLETE_PAYMENT'
        WHEN payment_status = 'REJECTED' THEN 'UNPAID'  -- Map REJECTED back to UNPAID
        ELSE 'PENDING'
      END
  `);
        yield queryInterface.removeColumn('ShippingStages', 'payment_status');
        yield queryInterface.renameColumn('ShippingStages', 'temp_payment_status', 'payment_status');
        yield queryInterface.changeColumn('ShippingStages', 'payment_status', {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT'),
            allowNull: false,
            defaultValue: 'PENDING',
        });
    });
}
