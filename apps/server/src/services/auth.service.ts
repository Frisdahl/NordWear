import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is not set!');
}

const SECRET = JWT_SECRET || 'dev-secret-key';

export const login = async (email: string, password: string): Promise<{ token: string; user: { id: number; email: string; role: Role; name: string; } }> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  // Compare provided password with hashed password in DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('INVALID_PASSWORD');
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, userRole: user.role },
    SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  // Return token and basic user info (without password hash)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    return prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.USER,
        },
      });
  
      await prisma.customer.create({
        data: {
          userId: user.id,
        },
      });
  
      return user;
    });
  };

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const updatePassword = async (userId: number, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
