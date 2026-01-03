import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const result = await authService.login(email, password);

    if (!result) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    // On successful login, set cookie and send user info
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ user: result.user });
  } catch (error) {
    console.error('Login error:', error);
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
