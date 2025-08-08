import type { ObjectId } from 'mongoose';

export type TokenPayload = {
  id: string | ObjectId;
  role?: string;
  iat?: number; // issued at
  exp?: number; // expiration time
};

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
