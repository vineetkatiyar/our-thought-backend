import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address').trim().toLowerCase();
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(100, 'Password is too long')
  .trim()
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
    'Password must contain at least one letter and one number',
  );

const phoneNumberSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be 10 digits')
  .optional();

export const registerUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
