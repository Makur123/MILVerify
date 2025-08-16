import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
      file?: Express.Multer.File;
    }
  }
}

export {};