import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendPasswordResetEmail } from './email.controller';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const result = await authService.login(email, password);

    // On successful login, set cookie and send user info
    const isProduction = process.env.NODE_ENV === 'production';
    const clientUrl = process.env.CLIENT_URL || '';
    const isSecure = isProduction && clientUrl.startsWith('https');

    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ user: result.user });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
      return;
    }
    if (error.message === 'INVALID_PASSWORD') {
      res.status(401).json({ message: 'Invalid password', code: 'INVALID_PASSWORD' });
      return;
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password are required.' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format.' });
    return;
  }

  // Password length validation
  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    return;
  }

  try {
    const newUser = await authService.register(name, email, password);
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error: any) {
    if (error.code === 'P2002') { // Prisma unique constraint error
      res.status(400).json({ message: 'Email already exists.' });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const userData = await authService.getUserById(user.id);
    if (!userData) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required.' });
    return;
  }

  try {
    const user = await authService.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Generate reset token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const sent = await sendPasswordResetEmail(email, token);
    
    if (sent) {
      res.status(200).json({ message: 'Reset email sent.' });
    } else {
      res.status(500).json({ message: 'Failed to send email.' });
    }
  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    
    // Verify user still exists
    const user = await authService.getUserById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    await authService.updatePassword(decoded.userId, password);
    
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Reset Password error:', error);
    if (error instanceof jwt.TokenExpiredError) {
        res.status(400).json({ message: 'Link has expired.' });
        return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({ message: 'Invalid token.' });
        return;
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
};
