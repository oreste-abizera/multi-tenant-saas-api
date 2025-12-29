import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { slugify } from '../utils/helpers';
import { Role } from '@prisma/client';

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = (req as AuthRequest).user!.id;

    const slug = slugify(name);

    // Check if organization with slug exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      res.status(409).json({
        success: false,
        message: 'Organization with this name already exists',
      });
      return;
    }

    // Create organization with owner membership
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: organization,
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user!.id;

    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });

    const organizations = memberships.map((m) => ({
      ...m.organization,
      role: m.role,
    }));

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const { name } = req.body;

    const slug = slugify(name);

    // Check if another organization has this slug
    const existingOrg = await prisma.organization.findFirst({
      where: {
        slug,
        id: { not: organizationId },
      },
    });

    if (existingOrg) {
      res.status(409).json({
        success: false,
        message: 'Organization with this name already exists',
      });
      return;
    }

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: { name, slug },
    });

    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: organization,
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId } = req.params;

    await prisma.organization.delete({
      where: { id: organizationId },
    });

    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const { email, role } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if membership exists
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId,
        },
      },
    });

    if (existingMembership) {
      res.status(409).json({
        success: false,
        message: 'User is already a member',
      });
      return;
    }

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId,
        role: role || Role.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: membership,
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateMemberRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;

    const membership = await prisma.membership.update({
      where: {
        id: memberId,
        organizationId,
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Member role updated successfully',
      data: membership,
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const removeMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId, memberId } = req.params;

    await prisma.membership.delete({
      where: {
        id: memberId,
        organizationId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
