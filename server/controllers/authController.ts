import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createAuthService } from '../services/authService';

const authService = createAuthService();

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

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await authService.signUp({ name, email, password });

    res.status(201).json(result.verificationToken);
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const result = await authService.login({ email, password });

    if (!result.isVerified) {
      console.log('User is not verified yet');
      res.status(200).json({
        isVerified: false,
        verificationToken: result.verificationToken,
        message: result.message,
      });
      return;
    }

    // Set refresh token in cookie
    res.cookie('refreshToken', result.refreshToken, getCookieOptions());
    res.status(200).json({
      loginToken: result.loginToken,
      isVerified: true,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'Invalid credentials') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { verificationToken, code } = req.body;

    if (!verificationToken || !code) {
      return res.status(400).json({ message: 'Token and code are required' });
    }

    const result = await authService.verifyEmail({
      token: verificationToken,
      code,
    });

    res.cookie('loginToken', result.refreshToken, getCookieOptions());

    res.status(200).json({
      message: 'Email verified successfully',
      token: result.loginToken,
      user: result.user,
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    if (
      error.message === 'Invalid or expired token' ||
      error.message === 'Invalid verification code' ||
      error.message === 'User not found'
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendCode = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ meesage: 'no token' });
    return;
  }
  try {
    const newToken = authService.generateNewCode(token);
    res.json(newToken);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resending token' });
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await authService.forgotPassword(email);

    res.status(200).json({
      resetPasswordToken: result.resetPasswordToken,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    const result = await authService.resetPassword({ token, newPassword });

    res.cookie('loginToken', result.loginToken, getCookieOptions());

    res.status(200).json({
      message: 'Password reset successfully',
      token: result.loginToken,
      user: result.user,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.adminId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await authService.getMe(userId);

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Get me error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ NEW CONTROLLER: Refresh Access Token
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({ token: result.loginToken });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return res.status(401).json({ message: error.message || 'Unauthorized' });
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
