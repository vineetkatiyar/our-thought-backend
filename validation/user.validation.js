import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address').trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(100, 'Password is too long')
  .trim()
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    'Password must contain at least one letter and one number',
  );

export const registerUserSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const getAllUsersQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    role: z.enum(['ADMIN', 'AUTHOR', 'READER']).optional(),
    status: z.enum(['ACTIVE', 'BANNED', 'DEACTIVATED']).optional(),
  })
  .refine((data) => data.page > 0, {
    message: 'Page must be greater than 0',
  })
  .refine((data) => data.limit > 0 && data.limit <= 50, {
    message: 'Limit must be between 1 and 50',
  });

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'BANNED', 'DEACTIVATED']).default('ACTIVE'),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'AUTHOR']).default('AUTHOR'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(300).optional(),
  avatar: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
});
