// authService.ts
import bcrypt from 'bcryptjs';

// Utility classes for better separation of concerns
import jwt, { SignOptions, JwtPayload as JwtPayloadBase } from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models/User';
import { AuthError, BadRequestError, NotFoundError } from '../errors/errors';
import { sendCustom, sendVerificationEmail } from './mailService';

// Configuration interface
interface AuthConfig {
  jwtSecret: string;
  clientUrl: string;
  tokenExpiration: {
    verification: number;
    login: number;
    refresh: number;
  };
}

// Token payload interfaces
interface JwtPayload {
  userId?: number;
  adminId?: number;
}

// Service interfaces
interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  token: string;
  code: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface UserResponse {
  id: number;
  name: string;
}

// Extend the base JwtPayload if you need custom properties
interface JwtPayload extends JwtPayloadBase {
  userId?: number;
  email?: string;
  [key: string]: any;
}

class TokenService {
  constructor(private readonly secret: string) {
    if (!secret) {
      throw new Error('JWT secret is required');
    }
  }

  generateToken(
    payload: JwtPayload,
    expiresIn: SignOptions['expiresIn']
  ): string {
    return jwt.sign(
      payload,
      this.secret,
      { expiresIn } as SignOptions // Type assertion if needed
    );
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

class PasswordService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Both passwords are required for comparison');
    }
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateResetToken(): { token: string; hashedToken: string } {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }
}

class AuthService {
  private tokenService: TokenService;
  private passwordService: PasswordService;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
    this.tokenService = new TokenService(config.jwtSecret);
    this.passwordService = new PasswordService();
  }

  async signUp(
    data: SignUpData
  ): Promise<{ verificationToken: string; userId: number }> {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AuthError('User already exists', 'USER_EXISTS');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    return this.generateVerificationDetails(newUser);
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const { email, password } = data;

    const user = await this.findUserByEmail(email);
    await this.validatePassword(user, password);

    if (!user.isVerified) {
      const { verificationToken } =
        await this.generateVerificationDetails(user);
      return {
        isVerified: false,
        verificationToken,
        message: 'Please verify your email first',
      };
    }

    const loginToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.login
    );

    const refreshToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.refresh
    );

    return {
      isVerified: true,
      loginToken,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ loginToken: string }> {
    const payload = this.tokenService.verifyToken(refreshToken);
    if (!payload.adminId) {
      throw new BadRequestError('Invalid refresh token');
    }
    const user = await this.findUserById(payload.adminId);
    const newAccessToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.login
    );
    return { loginToken: newAccessToken };
  }

  async verifyEmail(data: VerifyEmailData): Promise<LoginResponse> {
    const { token, code } = data;
    const { userId } = this.tokenService.verifyToken(token);
    if (!userId) {
      throw new BadRequestError('Unsuitable token');
    }
    const user = await this.findUserById(userId);
    this.validateVerificationCode(user, code);

    await this.markUserAsVerified(user);

    const loginToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.login
    );

    const refreshToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.refresh
    );
    user.refreshToken = refreshToken;
    return {
      isVerified: true,
      loginToken,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }
  async generateNewCode(token: string) {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });
    if (!user) throw new NotFoundError('user not found');
    const result = await this.generateVerificationDetails(user);
    return result.verificationToken;
  }
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const user = await this.findUserByEmail(email, false);
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const { token, hashedToken } = this.passwordService.generateResetToken();
    await this.setPasswordResetDetails(user, hashedToken);

    await this.sendPasswordResetEmail(user.email, token);

    return {
      resetPasswordToken: token,
      message: 'Password reset link sent to email',
    };
  }

  async resetPassword(data: ResetPasswordData): Promise<VerifiedResponse> {
    const { token, newPassword } = data;
    const user = await this.findUserByResetToken(token);

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.updateUserPassword(user, hashedPassword);

    const loginToken = this.tokenService.generateToken(
      { adminId: user.id },
      this.config.tokenExpiration.login
    );

    return {
      loginToken,
      user: this.formatUserResponse(user),
    };
  }

  async getMe(userId: number): Promise<UserResponse> {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'isVerified'],
    });

    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }

    return this.formatUserResponse(user);
  }

  // Private helper methods
  private async generateVerificationDetails(
    user: User
  ): Promise<{ verificationToken: string; userId: number }> {
    const verificationToken = this.tokenService.generateToken(
      { userId: user.id },
      this.config.tokenExpiration.verification
    );

    const verificationCode = this.generateVerificationCode();

    user.verificationCode = verificationCode;
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user);

    return { verificationToken, userId: user.id };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async findUserByEmail(
    email: string,
    throwIfNotFound = true
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user && throwIfNotFound) {
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    return user as User; // Type assertion
  }

  private async findUserById(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  private async validatePassword(user: User, password: string): Promise<void> {
    const isMatch = await this.passwordService.comparePasswords(
      password,
      user.password
    );
    if (!isMatch) {
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
  }

  private validateVerificationCode(user: User, code: string): void {
    if (user.verificationCode !== code) {
      throw new AuthError(
        'Invalid verification code',
        'INVALID_VERIFICATION_CODE'
      );
    }
  }

  private async markUserAsVerified(user: User): Promise<void> {
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationToken = null;
    await user.save();
  }

  private async findUserByResetToken(token: string): Promise<User> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new AuthError(
        'Invalid or expired reset token',
        'INVALID_RESET_TOKEN'
      );
    }
    return user;
  }

  private async setPasswordResetDetails(
    user: User,
    hashedToken: string
  ): Promise<void> {
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${this.config.clientUrl}/reset-password/${token}`;
    await sendCustom(email, {
      subject: 'Password Reset Request',
      message: `
        You requested a password reset. Click the link below to reset your password:
        <br><br>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <br><br>
        This link will expire in 1 hour. If you didn't request this, please ignore this email.
      `,
    });
  }

  private async updateUserPassword(
    user: User,
    hashedPassword: string
  ): Promise<void> {
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
  }

  private formatUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
    };
  }
}

// Response interfaces
interface LoginResponse {
  isVerified: boolean;
  loginToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  message?: string;
  user?: UserResponse;
}

interface VerifiedResponse {
  loginToken: string;
  user: UserResponse;
}

interface ForgotPasswordResponse {
  resetPasswordToken?: string;
  message: string;
}

// Factory function for easier initialization
export function createAuthService(): AuthService {
  return new AuthService({
    jwtSecret: process.env.JWT_SECRET || 'udorakpuenyi',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    tokenExpiration: {
      verification: 86400,
      login: 3600,
      refresh: 86400 * 7,
    },
  });
}
