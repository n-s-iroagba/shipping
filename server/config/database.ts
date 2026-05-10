import { Sequelize } from 'sequelize';
import { dbConfig, env } from '.';

// Initialize Sequelize
export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    port: dbConfig.port,
    logging: dbConfig.logging ? console.log : false,
    dialectOptions: dbConfig.ssl
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // For Aiven/managed DBs, this is often needed
        },
      }
      : {},
  }
);

// Test database connection and initialize models
export const connectDB = async (force: boolean = false) => {
  try {
    await sequelize.authenticate();
    console.log(`✅ ${env} Database connected successfully!`);

    // Import models to ensure they are initialized with associations
    await import('../models/init');

    // Sync database
    await sequelize
      .sync({ force: force })
      .then(() => console.log('✅ Tables formed with associations'));

    // Dynamically import scripts to prevent circular dependency with sequelize initialization
    const { default: seedDatabase } = await import('../scripts/seed');
    const { default: checkTableStructure } = await import('../scripts/check-table-structure');
    const { default: updatePaymentStatusEnum } = await import('../scripts/update-payment-status-migration');
    const { updateExistingPaymentStatus } = await import('../scripts/update-existing-payment-status');

    // Run seed idempotently
    await seedDatabase();

    // Run the check
    await checkTableStructure()
      .then(() => {
        console.log('\nTable structure check completed');
      })
      .catch((error) => {
        console.error('Check failed:', error);
      });
      
    await updatePaymentStatusEnum()
      .then(() => {
        console.log('Migration script finished successfully');
      })
      .catch((error) => {
        console.error('Migration script failed:', error);
      });
      
    await updateExistingPaymentStatus()
      .then(() => {
        console.log('\n🎉 PaymentStatus column update completed successfully!');
        console.log('Your ShippingStage model can now use the REJECTED status.');
      })
      .catch((error) => {
        console.error('Script failed:', error);
      });

  } catch (error) {
    console.error(`❌ Unable to connect to the ${env} database:`, error);
    process.exit(1);
  }
};
