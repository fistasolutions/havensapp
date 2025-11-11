/**
 * Password Hashing and Verification Utilities
 * Uses bcrypt for secure password hashing
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  if (!password || !hash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Optional: Add more complexity requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('Password must contain at least one uppercase letter');
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push('Password must contain at least one lowercase letter');
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('Password must contain at least one number');
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
};

