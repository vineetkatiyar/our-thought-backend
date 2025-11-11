import { z } from 'zod';

export const createStorySchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
    publishedAt: z.string().datetime().optional().nullable(),
  })
  .refine((data) => {
    // Only set publishedAt if status is PUBLISHED
    if (data.status === 'PUBLISHED' && !data.publishedAt) {
      return true; // We'll handle this in service
    }
    return true;
  });

export const getAllStoriesQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z.string().optional(),
  sortByOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  authorId: z.string().uuid().optional(),
});

export const getPublicStoriesQuerySchema = z
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
    sortBy: z.enum(['publishedAt', 'title', 'createdAt']).default('publishedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((data) => data.page > 0, {
    message: 'Page must be greater than 0',
  })
  .refine((data) => data.limit > 0 && data.limit <= 50, {
    message: 'Limit must be between 1 and 50',
  });

export const updateStorySchema = createStorySchema.partial();
