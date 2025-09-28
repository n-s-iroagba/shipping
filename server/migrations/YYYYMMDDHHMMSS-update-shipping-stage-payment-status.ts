// migrations/YYYYMMDDHHMMSS-update-shipping-stage-payment-status.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Step 1: Add a temporary column with the new enum
  await queryInterface.addColumn('ShippingStages', 'temp_payment_status', {
    type: DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED'),
    allowNull: true,
  });

  // Step 2: Copy data from old column to new column, mapping values as needed
  await queryInterface.sequelize.query(`
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
  await queryInterface.removeColumn('ShippingStages', 'payment_status');

  // Step 4: Rename the temporary column to the original name
  await queryInterface.renameColumn('ShippingStages', 'temp_payment_status', 'payment_status');

  // Step 5: Make the column non-nullable if it was before
  await queryInterface.changeColumn('ShippingStages', 'payment_status', {
    type: DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Reverse the migration - go back to the old enum
  await queryInterface.addColumn('ShippingStages', 'temp_payment_status', {
    type: DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT'),
    allowNull: true,
  });

  // Copy data back, excluding REJECTED status
  await queryInterface.sequelize.query(`
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

  await queryInterface.removeColumn('ShippingStages', 'payment_status');
  await queryInterface.renameColumn('ShippingStages', 'temp_payment_status', 'payment_status');

  await queryInterface.changeColumn('ShippingStages', 'payment_status', {
    type: DataTypes.ENUM('PENDING', 'PAID', 'NO_PAYMENT_REQUIRED', 'UNPAID', 'INCOMPLETE_PAYMENT'),
    allowNull: false,
    defaultValue: 'PENDING',
  });
}