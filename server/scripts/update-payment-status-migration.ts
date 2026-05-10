// scripts/mysql-update-payment-status.ts
import { sequelize } from '../config/database'; // Adjust path to your database config

export default async function updatePaymentStatusEnum() {
  try {
    console.log('Starting MySQL enum update for payment_status...');

    // Method 1: Direct ALTER TABLE MODIFY for MySQL
    console.log('Step 1: Modifying payment_status column to include REJECTED...');
    await sequelize.query(`
      ALTER TABLE \`ShippingStages\` 
      MODIFY COLUMN \`payment_status\` 
      ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED') 
      NOT NULL DEFAULT 'PENDING'
    `);

    console.log('Migration completed successfully!');

    // Verify the change
    console.log('Verifying the column definition...');
    const [results] = await sequelize.query(`
      SHOW COLUMNS FROM \`ShippingStages\` WHERE Field = 'payment_status'
    `);

    console.log('New column definition:', results);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
