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
