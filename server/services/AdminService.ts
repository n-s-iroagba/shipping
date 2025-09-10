// src/services/UserService.ts


import { Admin } from '../models/Admin'
import AdminRepository from '../repositories/AdminRepository'
import { SignUpRequestDto } from '../types/auth.types'
import { CryptoUtil } from '../utils/crpto.util'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors'
import logger from '../utils/logger'


export class AdminService {
  async findUserByEmail(
    email: string,
    shouldThrowError: boolean = false
  ): Promise<Admin | null> {
    try {
      const user = await AdminRepository.findUserByEmail(email)

      if (!user && shouldThrowError) {
        logger.warn('User not found by email', { email })
        throw new BadRequestError('INVALID_CREDENTIALS')
      }

      if (user) {
        logger.info('User found by email', { userId: user.id, email })
      }

      return user
    } catch (error) {
      logger.error('Error finding user by email', { email, error })
      throw error
    }
  }

  async findUserById(id: string | number): Promise<Admin> {
    try {
      const user = await AdminRepository.findUserById(id)

      if (!user) {
        logger.warn('User not found by ID', { userId: id })
        throw new NotFoundError('USER_NOT_FOUND')
      }

      logger.info('User found by ID', { userId: id })
      return user
    } catch (error) {
      logger.error('Error finding user by ID', { userId: id, error })
      throw error
    }
  }

  async findUserByResetToken(token: string): Promise<Admin> {
    try {
      const hashedToken = CryptoUtil.hashString(token)
      const user = await AdminRepository.findUserByResetToken(hashedToken)

      if (!user) {
        const users = await AdminRepository.getAllUsers()
        console.log(users)
        console.log(hashedToken)
        logger.warn('User not found by reset token or token expired')
        throw new UnauthorizedError('Invalid or expired reset token', 'INVALID_RESET_TOKEN')
      }

      logger.info('User found by reset token', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error finding user by reset token', { error })
      throw error
    }
  }

  async findUserByVerificationToken(token: string): Promise<Admin> {
    try {
      const user = await AdminRepository.findUserByVerificationToken(token)

      if (!user) {
        logger.warn('User not found by verification token')
        throw new NotFoundError('User not found')
      }

      logger.info('User found by verification token', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error finding user by verification token', { error })
      throw error
    }
  }

  async createUser(userData: SignUpRequestDto): Promise<Admin> {
    try {
      const existingUser = await this.findUserByEmail(userData.email)

      if (existingUser) {
        logger.warn('Attempt to create user with existing email', { email: userData.email })
        throw new UnauthorizedError('User already exists', 'USER_EXISTS')
      }

      const user = await AdminRepository.createUser(userData)

      logger.info('User created successfully', { userId: user.id, email: userData.email })
      return user
    } catch (error) {
      logger.error('Error creating user', { email: userData.email, error })
      throw error
    }
  }

  async updateUserVerification(
    user: Admin,
    verificationCode: string,
    verificationToken: string
  ): Promise<Admin> {
    try {
      const updates = {
        verificationCode,
        verificationToken
      }

      console.log('CODE IS', verificationCode)

      const updatedUser = await AdminRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for verification update')
      }

      logger.info('User verification details updated', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error updating user verification', { userId: user.id, error })
      throw error
    }
  }

  async markUserAsVerified(user: Admin): Promise<Admin> {
    try {
      const updates = {
        isEmailVerified: true,
        verificationCode: null,
        verificationToken: null
      }

      const updatedUser = await AdminRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for verification')
      }

      logger.info('User marked as verified', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error marking user as verified', { userId: user.id, error })
      throw error
    }
  }

  async setPasswordResetDetails(user: Admin, hashedToken: string): Promise<Admin> {
    try {
      const updates = {
        passwordResetToken: hashedToken
      }

      console.log('token', hashedToken)

      const updatedUser = await AdminRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for password reset')
      }

      console.log(updatedUser)
      logger.info('Password reset details set', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error setting password reset details', { userId: user.id, error })
      throw error
    }
  }

  async updateUserPassword(user: Admin, hashedPassword: string): Promise<Admin> {
    try {
      const updates = {
        password: hashedPassword,
        passwordResetToken: null
      }

      const updatedUser = await AdminRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for password update')
      }

      logger.info('User password updated successfully', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error updating user password', { userId: user.id, error })
      throw error
    }
  }
}