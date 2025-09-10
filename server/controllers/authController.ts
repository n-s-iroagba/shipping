
import { NextFunction, Request, Response } from 'express'


import {
  AuthServiceLoginResponse,
} from '../types/auth.types'
import { BadRequestError, NotFoundError } from '../utils/errors'

import logger from '../utils/logger'
import { createAuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

// Helper function to get cookie options
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 24 * 60 * 60 * 1000,
  };
};
interface AuthUser {
  id:number
  username:string
}

export class AuthController {
  private authService = createAuthService()

  /** 
   * Handles applicant sign-up and assigns the 'APPLICANT' role.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  signUpAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const verificationToken = await this.authService.signUp(req.body)
      res.status(201).json(verificationToken)
      return
    } catch (error) {
      next(error)
    }
  }


  /**
   * Resends email verification code.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  resendCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, id } = req.body
      const newToken = await this.authService.generateNewCode(token)
      res.json(newToken)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends password reset email.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body
      if (!email) {
        res.status(400).json({ message: 'Email is required' })
        return
      }

      await this.authService.forgotPassword(email)
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns currently authenticated user details.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.authService.getMe(userId as number)
      console.log('AUTH USER', user)
      res.status(200).json(user as AuthUser)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const result = await this.authService.login({ email, password })

      // Check if result has refreshToken property (verified user)
      if (typeof result !== 'string' &&'refreshToken' in result && 'accessToken' in result) {
        // User is verified
        const verified = result as AuthServiceLoginResponse

        const cookieOptions = getCookieOptions()
        console.log('Setting refresh token cookie with options:', cookieOptions)

        res.cookie('refreshToken', verified.refreshToken, cookieOptions)
        res.status(200).json({
          user: verified.user,
          accessToken: verified.accessToken,
        })
      } else {
      
        res.status(200).json(result)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Verifies user's email with improved cookie setting
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.verifyEmail(req.body)

      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie after verification:', cookieOptions)

      res.cookie('refreshToken', result.refreshToken, cookieOptions)

      const authUser = result.user
      console.log('auth user', authUser)

      res.status(200).json({
        user: authUser,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resetPassword(req.body)

      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie after password reset:', cookieOptions)

      res.cookie('refreshToken', result.refreshToken, cookieOptions)

      // Extract only the properties you need from the user object
      const userResponse = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        // Add other properties you need
      }

      res.status(200).json({
        user: userResponse,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('All cookies received:', req.cookies)
      console.log('Headers:', req.headers.cookie)

      const cookieHeader = req.headers.cookie
      console.log('Raw cookie header:', cookieHeader)

      if (!cookieHeader) {
        res.status(401).json({ message: 'No cookies provided' })
        return
      }

      // Extract the refreshToken value from the cookie string
      const refreshToken = cookieHeader
        .split(';')
        .find(cookie => cookie.trim().startsWith('refreshToken='))
        ?.split('=')[1]

      console.log('Extracted refresh token:', refreshToken ? 'Present' : 'Missing')
      console.log('Token preview:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None')

      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token found in cookies' })
        return
      }

      // Now pass just the token value (not the whole cookie header)
      const accessToken = await this.authService.refreshToken(refreshToken)
      res.status(200).json(accessToken)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logout with improved cookie clearing
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = process.env.NODE_ENV === 'production'

      const clearOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: '/', // Important: match the path used when setting
      }

      console.log('Clearing cookie with options:', clearOptions)
      res.clearCookie('refreshToken', clearOptions)

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
