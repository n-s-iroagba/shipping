import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import shipmentRoutes from './routes/shipmentRoutes';
import authRoutes from './routes/authRoutes';
import shippingStageRoutes from './routes/shippingStageRoutes';

import { connectDB, sequelize } from './config/database';
import paymentRoutes from './routes/paymentRoutes';
import documentTemplateRoutes from './routes/documentTemplateRoutes';
import { errorHandler } from './middleware/errorHandler';




const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();

// Middleware
app.use(urlencoded());
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.path}`);
  console.log('📦 Body:', req.body);
  next();
});

connectDB(true);

app.use('/api/payment',paymentRoutes)

app.use('/api/auth', authRoutes);
app.use('/api/stage', shippingStageRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/templates',documentTemplateRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
