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
// scripts/mysql-update-payment-status.ts
const database_1 = require("../config/database"); // Adjust path to your database config
function updatePaymentStatusEnum() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting MySQL enum update for payment_status...');
            // Method 1: Direct ALTER TABLE MODIFY for MySQL
            console.log('Step 1: Modifying payment_status column to include REJECTED...');
            yield database_1.sequelize.query(`
      ALTER TABLE \`ShippingStages\` 
      MODIFY COLUMN \`payment_status\` 
      ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED') 
      NOT NULL DEFAULT 'PENDING'
    `);
            console.log('Migration completed successfully!');
            // Verify the change
            console.log('Verifying the column definition...');
            const [results] = yield database_1.sequelize.query(`
      SHOW COLUMNS FROM \`ShippingStages\` WHERE Field = 'payment_status'
    `);
            console.log('New column definition:', results);
        }
        catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
// Run the migration
updatePaymentStatusEnum()
    .then(() => {
    console.log('Migration script finished successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
});
