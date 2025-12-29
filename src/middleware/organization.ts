import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { Role } from '@prisma/client';

export const requireOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const organizationId = req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: 'Organization ID is required',
      });
      return;
    }

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: authReq.user.id,
          organizationId: organizationId,
        },
      },
    });

    if (!membership) {
      res.status(403).json({
        success: false,
        message: 'Access denied: Not a member of this organization',
      });
      return;
    }

    authReq.organizationId = organizationId;
    authReq.userRole = membership.role;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;

    if (!authReq.userRole) {
      res.status(403).json({
        success: false,
        message: 'Access denied: Role not determined',
      });
      return;
    }

    if (!allowedRoles.includes(authReq.userRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied: Requires one of [${allowedRoles.join(', ')}] role`,
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole([Role.OWNER, Role.ADMIN]);
export const requireOwner = requireRole([Role.OWNER]);
