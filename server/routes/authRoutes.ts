import express from 'express'

import { AuthController } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendCodeSchema,
  resetPasswordSchema,
  verifyEmailCodeSchema,
} from '../validation/auth.validation'

const router = express.Router()
const authController = new AuthController()

router.post('/signup', validateBody(registerSchema), authController.signUpAdmin)

router.post('/login', validateBody(loginSchema), authController.login)
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword)
router.post(
  '/reset-password',

  validateBody(resetPasswordSchema),
  authController.resetPassword
)

router.post('/verify-email', validateBody(verifyEmailCodeSchema), authController.verifyEmail)
router.post('/resend-code', validateBody(resendCodeSchema), authController.resendCode)
router.get('/refresh-token', authController.refreshToken)
router.get('/me', authenticate, authController.getMe)

export default router