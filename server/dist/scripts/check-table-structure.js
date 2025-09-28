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
// scripts/check-table-structure.ts
const database_1 = require("../config/database"); // Adjust path to your database config
function checkTableStructure() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Checking ShippingStages table structure...');
            // Get all columns in the table
            const [columns] = yield database_1.sequelize.query(`
      SHOW COLUMNS FROM \`ShippingStages\`
    `);
            console.log('Current columns in ShippingStages:');
            console.table(columns);
            // Check if payment_status exists
            const paymentStatusColumn = columns.find(col => col.Field === 'payment_status');
            if (paymentStatusColumn) {
                console.log('\n✅ payment_status column exists:');
                console.log(paymentStatusColumn);
            }
            else {
                console.log('\n❌ payment_status column does NOT exist');
                // Check for similar columns
                const similarColumns = columns.filter(col => col.Field.toLowerCase().includes('payment') ||
                    col.Field.toLowerCase().includes('status'));
                if (similarColumns.length > 0) {
                    console.log('\nSimilar columns found:');
                    console.table(similarColumns);
                }
            }
        }
        catch (error) {
            console.error('Failed to check table structure:', error);
            throw error;
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
// Run the check
checkTableStructure()
    .then(() => {
    console.log('\nTable structure check completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('Check failed:', error);
    process.exit(1);
});
