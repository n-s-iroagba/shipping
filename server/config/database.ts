import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path: envPath });

// Database configuration
const dbConfig = {
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  dialect: 'mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.SSL_MODE === 'REQUIRED',
};
// Verify environment variables are loaded
console.log('DB_USER:', process.env.DB_USER); // Debug check
console.log('DB_NAME:', process.env.DB_NAME); // Debug check
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
  } catch (error) {
    console.error(`❌ Unable to connect to the ${env} database:`, error);
    process.exit(1);
  }
};
