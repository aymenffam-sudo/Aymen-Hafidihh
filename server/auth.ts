import bcrypt from 'bcryptjs';
import { getUserByUsername, createUser, updateUser } from './db';
import { User } from '../drizzle/schema';

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username);
  
  if (!user || !user.passwordHash) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  
  if (!isPasswordValid) {
    return null;
  }

  // Update last signed in
  await updateUser(user.id, {
    lastSignedIn: new Date(),
  });

  return user;
}

/**
 * Register new user with username and password
 */
export async function registerUser(username: string, password: string, name?: string): Promise<User | null> {
  const existingUser = await getUserByUsername(username);
  
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const passwordHash = await hashPassword(password);
  
  const result = await createUser({
    username,
    passwordHash,
    name: name || username,
    loginMethod: 'password',
    role: 'user',
    isActive: true,
  });

  const newUser = await getUserByUsername(username);
  return newUser || null;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 255) {
    return { valid: false, error: 'Username must be at most 255 characters long' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
}
