import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development

export const login = async (email: string, password: string): Promise<{ token: string; user: { id: number; email: string; role: Role; name: string; } } | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null; // User not found
  }

  // Compare provided password with hashed password in DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null; // Invalid credentials
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, userRole: user.role },
    JWT_SECRET,
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
