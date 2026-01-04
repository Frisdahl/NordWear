import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response): Promise<void> => {
  const isProduction = process.env.NODE_ENV === 'production';
  const clientUrl = process.env.CLIENT_URL || '';
  const isSecure = isProduction && clientUrl.startsWith('https');

  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
};
