// scripts/update-existing-payment-status.ts
import { sequelize } from '../config/database'; // Adjust path to your database config

async function updateExistingPaymentStatus() {
  try {
    console.log('Updating existing paymentStatus column...');
    
    // Current column: paymentStatus with enum('PENDING','PAID','NO_PAYMENT_REQUIRED','UNPAID','INCOMPLETE_PAYMENT')
    // Target: Add 'REJECTED' to the enum and make it NOT NULL with default 'PENDING'
    
    console.log('Step 1: Modifying paymentStatus column to include REJECTED...');
    await sequelize.query(`
      ALTER TABLE \`ShippingStages\` 
      MODIFY COLUMN \`paymentStatus\` 
      ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED') 
      NOT NULL DEFAULT 'PENDING'
    `);

    console.log('✅ Successfully updated paymentStatus column!');
    
    // Verify the result
    console.log('\nStep 2: Verifying the updated column...');
    const [result] = await sequelize.query(`
      SHOW COLUMNS FROM \`ShippingStages\` WHERE Field = 'paymentStatus'
    `);
    
    console.log('Updated column definition:');
    console.table(result);
    
    // Check if there are any NULL values that need to be updated
    console.log('\nStep 3: Checking for any NULL values...');
    const [nullCheck] = await sequelize.query(`
      SELECT COUNT(*) as nullCount FROM \`ShippingStages\` WHERE \`paymentStatus\` IS NULL
    `);
    
    const nullCount = (nullCheck as any)[0].nullCount;
    console.log(`Found ${nullCount} rows with NULL paymentStatus`);
    
    if (nullCount > 0) {
      console.log('Step 4: Updating NULL values to PENDING...');
      await sequelize.query(`
        UPDATE \`ShippingStages\` SET \`paymentStatus\` = 'PENDING' WHERE \`paymentStatus\` IS NULL
      `);
      console.log('✅ Updated NULL values to PENDING');
    } else {
      console.log('✅ No NULL values found, no additional updates needed');
    }
    
  } catch (error) {
    console.error('Failed to update paymentStatus column:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
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