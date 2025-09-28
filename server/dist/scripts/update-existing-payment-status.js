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
// scripts/update-existing-payment-status.ts
const database_1 = require("../config/database"); // Adjust path to your database config
function updateExistingPaymentStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Updating existing paymentStatus column...');
            // Current column: paymentStatus with enum('PENDING','PAID','NO_PAYMENT_REQUIRED','UNPAID','INCOMPLETE_PAYMENT')
            // Target: Add 'REJECTED' to the enum and make it NOT NULL with default 'PENDING'
            console.log('Step 1: Modifying paymentStatus column to include REJECTED...');
            yield database_1.sequelize.query(`
      ALTER TABLE \`ShippingStages\` 
      MODIFY COLUMN \`paymentStatus\` 
      ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED') 
      NOT NULL DEFAULT 'PENDING'
    `);
            console.log('✅ Successfully updated paymentStatus column!');
            // Verify the result
            console.log('\nStep 2: Verifying the updated column...');
            const [result] = yield database_1.sequelize.query(`
      SHOW COLUMNS FROM \`ShippingStages\` WHERE Field = 'paymentStatus'
    `);
            console.log('Updated column definition:');
            console.table(result);
            // Check if there are any NULL values that need to be updated
            console.log('\nStep 3: Checking for any NULL values...');
            const [nullCheck] = yield database_1.sequelize.query(`
      SELECT COUNT(*) as nullCount FROM \`ShippingStages\` WHERE \`paymentStatus\` IS NULL
    `);
            const nullCount = nullCheck[0].nullCount;
            console.log(`Found ${nullCount} rows with NULL paymentStatus`);
            if (nullCount > 0) {
                console.log('Step 4: Updating NULL values to PENDING...');
                yield database_1.sequelize.query(`
        UPDATE \`ShippingStages\` SET \`paymentStatus\` = 'PENDING' WHERE \`paymentStatus\` IS NULL
      `);
                console.log('✅ Updated NULL values to PENDING');
            }
            else {
                console.log('✅ No NULL values found, no additional updates needed');
            }
        }
        catch (error) {
            console.error('Failed to update paymentStatus column:', error);
            throw error;
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
// Run the script
updateExistingPaymentStatus()
    .then(() => {
    console.log('\n🎉 PaymentStatus column update completed successfully!');
    console.log('Your ShippingStage model can now use the REJECTED status.');
    process.exit(0);
})
    .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
});
