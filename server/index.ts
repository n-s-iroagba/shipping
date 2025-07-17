import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';

import cors from 'cors';
import shipmentRoutes from './routes/shipmentRoutes';
import authRoutes from './routes/authRoutes';
import shippingStageRoutes from './routes/shippingStageRoutes';
import { upload } from './middleware/upload';

dotenv.config();

const app = express();

// Middleware
app.use(urlencoded());
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL || 'https://your-production-domain.com'
      : 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.path}`);
  console.log('📦 Body:', req.body);
  next();
});

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/stage', shippingStageRoutes);
app.use('/api/shipment', shipmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
