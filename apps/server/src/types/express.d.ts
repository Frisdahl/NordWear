import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      user?: {
        id: number;
        role: Role;
      };
    }
  }
}

export {};