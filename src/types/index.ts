import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  organizationId?: string;
  userRole?: Role;
}

export interface JWTPayload {
  id: string;
  email: string;
}
