import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();
export const env = process.env.NODE_ENV || 'development';

export const dbConfig = {
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  dialect: 'mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.SSL_MODE === 'REQUIRED',
};

export const ClientUrl = process.env.CLIENT_URL