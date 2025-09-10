// services/verification.service.ts


import { CodeHelper } from '../utils/codeHelper'
import Admin from '../models/Admin'
import logger from '../utils/logger'
import { TokenService } from './TokenService'
import { BadRequestError, ForbiddenError } from '../utils/errors'
import { AuthConfig } from '../types/auth.types'

import dotenv from 'dotenv'
import { AdminService } from './AdminService'
import { EmailService } from './EmailService'
dotenv.config()
export class VerificationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: AdminService,
    private readonly emailService: EmailService,
    private readonly config: AuthConfig
  ) {}

  async generateVerificationDetails(
    user: Admin
  ): Promise<{ verificationToken: string; id: number }> {
    try {
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)

      const verificationCode =
        process.env.NODE_ENV === 'production' ? CodeHelper.generateVerificationCode() : '123456'
      console.log('VVVV', verificationCode)

      await this.userService.updateUserVerification(user, verificationCode, verificationToken)
      await this.emailService.sendVerificationEmail(user,verificationCode)

      logger.info('Verification details generated successfully', { userId: user.id })
      return { verificationToken, id: user.id }
    } catch (error) {
      logger.error('Error generating verification details', { userId: user.id, error })
      throw error
    }
  }

  async regenerateVerificationCode(token: string): Promise<string> {
    try {
      const user = await this.userService.findUserByVerificationToken(token)
      if(!user) throw new BadRequestError('User does not exist')
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)
      
          const verificationCode =
         process.env.NODE_ENV === 'production' ? CodeHelper.generateVerificationCode() : '123456'
      console.log('VVVV', verificationCode)

      await this.userService.updateUserVerification(user, verificationCode, verificationToken)
 
      await this.emailService.sendVerificationEmail(user,verificationCode)

      logger.info('Verification code regenerated', { userId: user.id })
      return verificationToken
    } catch (error) {
      logger.error('Error regenerating verification code', { error })
      throw error
    }
  }

  validateVerificationCode(user: Admin, code: string): void {
    console.log(user)
    if (user.verificationCode !== code) {
      logger.warn('Invalid verification code provided', { userId: user.id })
      throw new ForbiddenError('Invalid verification code', 'INVALID_VERIFICATION_CODE')
    }
    logger.info('Verification code validated successfully', { userId: user.id })
  }
}