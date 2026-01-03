import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  offer_price: z.number().positive().optional().nullable(),
  status: z.enum(["ONLINE", "OFFLINE", "DRAFT"]),
  category_Id: z.number().int().positive(),
  varenummer: z.string().optional().nullable(),
  barkode: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const giftCardSchema = z.object({
  code: z.string().min(1, "Code is required"),
  amount: z.union([z.string(), z.number()]), // Client sends string, we parse it
  expiresAt: z.string().optional().nullable(),
});
