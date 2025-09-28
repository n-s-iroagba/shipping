

import { ClientUrl } from '../config'
import {Admin} from '../models/Admin'
import {
  AuthConfig,
  AuthServiceLoginResponse,
  LoginRequestDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from '../types/auth.types'
import { BadRequestError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'
import { AdminService } from './AdminService'
import { EmailService } from './EmailService'
import  emailService from './EmailService'
// import { EmailService } from './EmailService'
import { PasswordService } from './PasswordService'
import { TokenService } from './TokenService'
import { VerificationService } from './VerificationService'
import dotenv from 'dotenv'
interface AuthUser{
  username:string
}
dotenv.config()
export class AuthService {
  private tokenService: TokenService
  private passwordService: PasswordService
  private adminService: AdminService
  private emailService: EmailService
  private verificationService: VerificationService
  roleService: any

  constructor(private readonly config: AuthConfig) {
    this.tokenService = new TokenService(config.jwtSecret)
    this.passwordService = new PasswordService()
    this.adminService = new AdminService()
    this.emailService = emailService
    this.verificationService = new VerificationService(
      this.tokenService,
      this.adminService,
      this.emailService,
      config
    )

    logger.info('AuthService initialized successfully')
  }

  /**
   * Registers a new user and initiates email verification.
   * @param data - User sign-up data.
   * @param roles - Optional array of user roles.
   * @returns Sign-up response with verification token.
   */
  async signUp(data: SignUpRequestDto): Promise<string> {
    try {
      logger.info('Sign up process started', { email: data.email })

      const hashedPassword = await this.passwordService.hashPassword(data.password)
      const user = await this.adminService.createUser({
        ...data,
        password: hashedPassword,
      })

      const result = await this.verificationService.generateVerificationDetails(user)

      logger.info('Sign up completed successfully', { userId: user.id })
      return result.verificationToken
    } catch (error) {
      throw error
    }
  }



  /**
   * Logs a user in by validating credentials and returning tokens.
   * @param data - Login DTO containing email and password.
   * @returns LoginAuthServiceReturn or SignUpResponseDto for unverified users.
   */
  async login(data: LoginRequestDto): Promise<AuthServiceLoginResponse | string> {
    try {
      logger.info('Login attempt started', { email: data.email })

      const user = await this.adminService.findUserByEmail(data.email, true)
      console.log('PASSWORD', user?.password)
      await this.validatePassword(user, data.password)
      if (!user) {
        throw new NotFoundError('user not found')
      }

      if (!user.isEmailVerified) {
        logger.warn('Login attempted by unverified user', { userId: user.id })
       
         return (await this.verificationService.generateVerificationDetails(user)).verificationToken
        
      }
     
      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Login successful', { userId: user?.id })
      const returnUser = { ...user.get({ plain: true }) }
      user.refreshToken = refreshToken
      await user.save()
      return { user: returnUser, accessToken, refreshToken }
    } catch (error) {
      throw error
    }
  }

  /**
   * Issues a new access token from a refresh token.
   * @param refreshToken - JWT refresh token.
   * @returns Object containing a new access token.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      logger.info('Token refresh attempted')

      const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh')
      console.log(decoded)

      if (!decoded.id) {
        logger.warn('Invalid refresh token provided')
        throw new BadRequestError('Invalid refresh token')
      }

      const user = await this.adminService.findUserById(decoded.id)
      const newAccessToken = this.tokenService.generateAccessToken(user)

      logger.info('Token refreshed successfully', { userId: user.id })
      return { accessToken: newAccessToken }
    } catch (error) {
      throw error
    }
  }

  /**
   * Verifies a user's email using a token and code.
   * @param data - DTO containing token and verification code.
   * @returns Auth tokens for the verified user.
   */
  async verifyEmail(data: VerifyEmailRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Email verification started')

      const { decoded } = this.tokenService.verifyToken(
        data.verificationToken,
        'email_verification'
      )
      console.log(decoded)
      const userId = decoded.AdminId

      if (!userId) {
        logger.warn('Invalid verification token provided')
        throw new BadRequestError('Unsuitable token')
      }

      const user = await this.adminService.findUserById(userId)
  

      this.verificationService.validateVerificationCode(user, data.verificationCode)
      await this.adminService.markUserAsVerified(user)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Email verification successful', { userId: user.id })
      const returnUser = { ...user.get({ plain: true }) }
      user.refreshToken = refreshToken
      await user.save()
      return { user: returnUser, accessToken, refreshToken }
    } catch (error) {
      throw error
    }
  }

  /**
   * Generates a new email verification code.
   * @param token - JWT token associated with the verification.
   * @returns A new verification code string.
   */
  async generateNewCode(token: string): Promise<string> {
    try {
      logger.info('New verification code generation requested')
      return await this.verificationService.regenerateVerificationCode( token)
    } catch (error) {
      throw error
    }
  }

  /**
   * Sends a password reset email to the user.
   * @param email - User's email address.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      logger.info('Password reset requested', { email })

      const user = await this.adminService.findUserByEmail(email)
      if (!user) {
        logger.error('Password reset requested for non-existent email', { email })
        throw new NotFoundError('user for forgot password not found')
      }

      const { token, hashedToken } = this.passwordService.generateResetToken()
      await this.adminService.setPasswordResetDetails(user, hashedToken)
      await this.emailService.sendPasswordResetEmail(user.email, token)

      logger.info('Password reset email sent', { userId: user.id })
    } catch (error) {
      throw error
    }
  }

  /**
   * Resets the user's password using the reset token.
   * @param data - DTO with new password and reset token.
   * @returns New auth tokens.
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Password reset process started')

      const user = await this.adminService.findUserByResetToken(data.resetPasswordToken)
      const hashedPassword = await this.passwordService.hashPassword(data.password)
      await this.adminService.updateUserPassword(user, hashedPassword)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Password reset successful', { userId: user.id })
     
      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken)
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieves a user by ID.
   * @param userId - ID of the user.
   * @returns User object.
   */
  async getUserById(userId: string) {
    try {
      logger.info('Get user by ID requested', { userId })

      const user = await this.adminService.findUserById(userId)
      logger.info('User retrieved successfully', { userId: user.id })

      return user
    } catch (error) {
      throw error
    }
  }

  /**
   * Returns the current authenticated user's details.
   * @param userId - Authenticated user's ID.
   * @returns User object.
   */
  async getMe(userId: number): Promise<AuthUser> {
    try {
      logger.info('Get current user requested', { userId })

      const user = await this.adminService.findUserById(userId)
      logger.info('Current user retrieved successfully', { userId })

      return user as unknown as AuthUser
    } catch (error) {
      throw error
    }
  }

  /**
   * Compares the given password with the user's stored password.
   * @param user - User instance.
   * @param password - Plain text password to validate.
   */
  private async validatePassword(user: any, password: string): Promise<void> {
    const isMatch = await this.passwordService.comparePasswords(password, user.password)
    if (!isMatch) {
      logger.warn('Password validation failed', { userId: user.id })
      throw new BadRequestError('Invalid credentials', 'INVALID_CREDENTIALS')
    }
    logger.info('Password validated successfully', { userId: user.id })
  }

  /**
   * Generates a new access/refresh token pair.
   * @param userId - ID of the user.
   * @returns Object containing access and refresh tokens.
   */
  private generateTokenPair(user: Admin): { accessToken: string; refreshToken: string } {
    const accessToken = this.tokenService.generateAccessToken(user)

    const refreshToken = this.tokenService.generateRefreshToken(user)

    return { accessToken, refreshToken }
  }

  /**
   * Saves the refresh token on the user and returns the full auth response.
   * @param user - User instance.
   * @param accessToken - JWT access token.
   * @param refreshToken - JWT refresh token.
   * @returns Full login/auth return object.
   */
  private async saveRefreshTokenAndReturn(
    passedUser: any,
    accessToken: string,
    refreshToken: string,
  
  ): Promise<AuthServiceLoginResponse> {
    passedUser.refreshToken = refreshToken
    await passedUser.save()
    const user = { ...passedUser }

    return { accessToken, user, refreshToken }
  }
}


// factory/auth.factory.ts
export function createAuthService(): AuthService {
  const config: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET || 'udorakpuenyi',
    clientUrl: ClientUrl as string,
    tokenExpiration: {
      verification: 86400,
      login: 3600,
      refresh: 86400 * 7,
    },
  }

  logger.info('AuthService factory creating new instance')
  return new AuthService(config)
}