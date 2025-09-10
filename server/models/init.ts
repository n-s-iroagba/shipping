/**
 * Model initialization file
 * This file ensures all models and their associations are properly loaded
 */

import { sequelize } from '../config/database';

// Import all models through the index file
import {
  Admin,
  Shipment,
  ShippingStage,
  Payment,
  CryptoWallet,
  DocumentTemplate,
} from './index';

// Export models for use in other parts of the application
export {
  sequelize,
  Admin,
  Shipment,
  ShippingStage,
  Payment,
  CryptoWallet,
  DocumentTemplate,
};

// Function to sync all models with the database
export const syncModels = async (options?: {
  force?: boolean;
  alter?: boolean;
}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

// Function to test model associations
export const testAssociations = () => {
  console.log('🔍 Testing model associations...');

  // Test User associations
  console.log('User associations:', Object.keys(Admin.associations));

  // Test Shipment associations
  console.log('Shipment associations:', Object.keys(Shipment.associations));

  // Test ShippingStage associations
  console.log(
    'ShippingStage associations:',
    Object.keys(ShippingStage.associations)
  );

  // Test Payment associations
  console.log('Payment associations:', Object.keys(Payment.associations));

  // Test CryptoWallet associations
  console.log(
    'CryptoWallet associations:',
    Object.keys(CryptoWallet.associations)
  );

  console.log('✅ Association test complete');
};
