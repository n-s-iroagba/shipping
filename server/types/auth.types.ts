import { AuthUser } from '../models/Admin'

export interface AuthConfig {
  jwtSecret: string
  clientUrl: string
  tokenExpiration: {
    verification: number
    login: number
    refresh: number
  }
}

export type SignUpRequestDto = {
  email: string
  password: string
  username: string
}

export interface VerifyEmailRequestDto {
  verificationCode: string
  verificationToken: string
}
export interface LoginRequestDto {
  email: string
  password: string
}
export type AuthServiceLoginResponse = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export type LoginResponseDto = {
  accessToken: string
  user: AuthUser
}

export interface ForgotPasswordRequestDto {
  email: string
}

export type ForgotPasswordResponseDto = {
  resetPasswordToken: string
}

export interface ResetPasswordRequestDto {
  resetPasswordToken: string
  password: string
  confirmPassword: string
}
