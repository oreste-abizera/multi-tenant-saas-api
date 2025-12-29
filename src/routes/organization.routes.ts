import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  addMember,
  updateMemberRole,
  removeMember,
} from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth';
import {
  requireOrganization,
  requireAdmin,
  requireOwner,
} from '../middleware/organization';
import { validate } from '../middleware/validate';
import { Role } from '@prisma/client';

const router = Router();

// Create organization (authenticated users)
router.post(
  '/',
  authenticate,
  [body('name').notEmpty().withMessage('Organization name is required'), validate],
  createOrganization
);

// Get all organizations for current user
router.get('/', authenticate, getOrganizations);

// Get specific organization (requires membership)
router.get(
  '/:organizationId',
  authenticate,
  requireOrganization,
  getOrganization
);

// Update organization (requires admin)
router.put(
  '/:organizationId',
  authenticate,
  requireOrganization,
  requireAdmin,
  [body('name').notEmpty().withMessage('Organization name is required'), validate],
  updateOrganization
);

// Delete organization (requires owner)
router.delete(
  '/:organizationId',
  authenticate,
  requireOrganization,
  requireOwner,
  deleteOrganization
);

// Add member to organization (requires admin)
router.post(
  '/:organizationId/members',
  authenticate,
  requireOrganization,
  requireAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn([Role.OWNER, Role.ADMIN, Role.MEMBER])
      .withMessage('Invalid role'),
    validate,
  ],
  addMember
);

// Update member role (requires admin)
router.put(
  '/:organizationId/members/:memberId',
  authenticate,
  requireOrganization,
  requireAdmin,
  [
    param('memberId').notEmpty().withMessage('Member ID is required'),
    body('role')
      .isIn([Role.OWNER, Role.ADMIN, Role.MEMBER])
      .withMessage('Invalid role'),
    validate,
  ],
  updateMemberRole
);

// Remove member (requires admin)
router.delete(
  '/:organizationId/members/:memberId',
  authenticate,
  requireOrganization,
  requireAdmin,
  [param('memberId').notEmpty().withMessage('Member ID is required'), validate],
  removeMember
);

export default router;
