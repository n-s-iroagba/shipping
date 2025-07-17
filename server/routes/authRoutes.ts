import { Router } from 'express';
import {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  refreshAccessToken,
  logout,
  resendCode,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout); // ✅ logout route

export default router;
