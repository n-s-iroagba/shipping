import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'udorakpuenyi';

export interface AuthRequest extends Request {
  user?: {
    adminId: number;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log('toke', token);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: number };

    // Add user to request
    req.user = { adminId: decoded.adminId };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
