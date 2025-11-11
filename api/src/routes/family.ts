/**
 * Family Routes
 * API routes for family/friend group functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';
import prisma from '../config/database';

const router = Router();

// All family routes require authentication
router.use(authenticateToken);

/**
 * POST /family/groups
 * Create a family/friend group
 */
router.post(
  '/groups',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { name } = req.body;

    if (!name) {
      throw new ApplicationError('Group name is required', 400);
    }

    const group = await prisma.familyGroup.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: 'Admin',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({ group });
  }),
);

/**
 * GET /family/groups
 * Get user's family groups
 */
router.get(
  '/groups',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const memberships = await prisma.familyGroupMember.findMany({
      where: {
        userId,
        leftAt: null,
      },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({ groups: memberships.map((m) => m.group) });
  }),
);

/**
 * POST /family/groups/:groupId/members
 * Add a member to a family group
 */
router.post(
  '/groups/:groupId/members',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { groupId } = req.params;
    const { memberEmail } = req.body;

    if (!memberEmail) {
      throw new ApplicationError('Member email is required', 400);
    }

    // Verify user is admin of the group
    const membership = await prisma.familyGroupMember.findFirst({
      where: {
        groupId,
        userId,
        role: 'Admin',
        leftAt: null,
      },
    });

    if (!membership) {
      throw new ApplicationError('Only admins can add members', 403);
    }

    // Find user by email
    const member = await prisma.user.findUnique({
      where: { email: memberEmail },
    });

    if (!member) {
      throw new ApplicationError('User not found', 404);
    }

    // Add member to group
    const newMembership = await prisma.familyGroupMember.create({
      data: {
        groupId,
        userId: member.id,
        role: 'Member',
      },
    });

    res.status(201).json({ membership: newMembership });
  }),
);

export default router;

