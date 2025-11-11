/**
 * Authentication Routes
 * Handles user registration and login
 */

import { Router, Request, Response } from 'express';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { generateTokenPair } from '../utils/jwt';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';
import prisma from '../config/database';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role, firstName, lastName, age } = req.body;

    // Validation
    if (!email || !password || !role) {
      throw new ApplicationError(
        'Email, password, and role are required',
        400,
        'MISSING_FIELDS',
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApplicationError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new ApplicationError(
        passwordValidation.errors.join(', '),
        400,
        'WEAK_PASSWORD',
      );
    }

    // Validate role
    const validRoles = ['Individual', 'Provider', 'Partner', 'FamilyFriends', 'Kid'];
    if (!validRoles.includes(role)) {
      throw new ApplicationError('Invalid role', 400, 'INVALID_ROLE');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApplicationError('User already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Get analytics consent from request (optional, defaults to false)
    const analyticsConsent = req.body.analyticsConsent === true;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        firstName: firstName || null,
        lastName: lastName || null,
        age: age || null,
        analyticsConsent,
        dataRetentionPreference: 2555, // 7 years default
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      user,
      ...tokens,
    });
  }),
);

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ApplicationError(
        'Email and password are required',
        400,
        'MISSING_FIELDS',
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is deleted
    if (user.deletedAt) {
      throw new ApplicationError('Account has been deleted', 401, 'ACCOUNT_DELETED');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    });
  }),
);

export default router;

