import prisma from '../config/prismaClient.js';
import { generateUniqueSlug, slugConfigs } from '../utils/autoGenerateSlug.js';
import { paginate } from '../utils/pagination.js';

const storyService = {
  async createStory({ title, content, coverImage, status, visibility, publishedAt }, authorId) {
    try {
      const finalPublishedAt =
        status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : null;

      const slug = await generateUniqueSlug(title, prisma, slugConfigs.multilingual);

      const newStory = await prisma.story.create({
        data: {
          title,
          slug,
          content,
          coverImage: coverImage || null,
          status,
          visibility,
          publishedAt: finalPublishedAt,
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return newStory;
    } catch (error) {
      console.log('Error in storyService.createStory:', error);
      throw error;
    }
  },

  async getStoryById(storyId) {
    try {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return story;
    } catch (error) {
      console.log('Error in storyService.getStoryById:', error);
      throw error;
    }
  },

  async getStoriesByAuthor(authorId, validatedQuery) {
    try {
      const {
        search,
        status,
        sortBy = 'createdAt',
        sortByOrder = 'desc',
        page = 1,
        limit = 10,
      } = validatedQuery;

      let whereClause = { authorId };

      if (search) {
        whereClause.title = { contains: search, mode: 'insensitive' };
      }

      if (status) {
        whereClause.status = status;
      }

      const totalCount = await prisma.story.count({ where: whereClause });

      const {
        skip,
        limit: itemsPerPage,
        page: currentPage,
        totalPages,
        hasPrevious,
        hasNext,
      } = paginate({ page, limit }, totalCount);

      const stories = await prisma.story.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortByOrder },
        skip,
        take: itemsPerPage,
      });

      return {
        stories,
        pagination: {
          currentPage,
          totalPages,
          totalItems: totalCount,
          itemsPerPage,
          hasNext,
          hasPrevious,
        },
        filters: {
          search: search || '',
          status: status || '',
          authorId: authorId || '',
          sortBy,
          sortByOrder,
        },
      };
    } catch (error) {
      console.log('Error in storyService.getStoriesByAuthor:', error);
      throw error;
    }
  },
  async getAllStories(validatedQuery) {
    try {
      const {
        search,
        status,
        sortBy = 'createdAt',
        sortByOrder = 'desc',
        page = 1,
        limit = 10,
        authorId,
      } = validatedQuery;

      let whereClause = {};

      if (search) {
        whereClause.title = { contains: search, mode: 'insensitive' };
      }

      if (status) {
        whereClause.status = status;
      }

      if (authorId) {
        whereClause.authorId = authorId;
      }

      const totalCount = await prisma.story.count({ where: whereClause });

      const {
        skip,
        limit: itemsPerPage,
        page: currentPage,
        totalPages,
        hasPrevious,
        hasNext,
      } = paginate({ page, limit }, totalCount);

      const stories = await prisma.story.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: itemsPerPage,
        orderBy: { [sortBy]: sortByOrder },
      });

      return {
        stories,
        pagination: {
          currentPage,
          totalPages,
          totalItems: totalCount,
          itemsPerPage,
          hasNext,
          hasPrevious,
        },
        filters: {
          search: search || '',
          status: status || '',
          authorId: authorId || '',
          sortBy,
          sortByOrder,
        },
      };
    } catch (error) {
      console.log('Error in storyService.getAllStories:', error);
      throw error;
    }
  },

  async deleteStory(storyId, user) {
    try {
      const story = await prisma.story.findUnique({ where: { id: storyId } });

      if (!story) {
        throw new Error('Story not found');
      }

      if (user.role !== 'ADMIN' && story.authorId !== user.id) {
        throw new Error('Unauthorized to delete this story');
      }
      const deletedStory = await prisma.story.delete({ where: { id: storyId } });

      if (!deletedStory) {
        throw new Error('Failed to delete the story');
      }
    } catch (error) {
      console.log('Error in storyService.deleteStory:', error);
      throw error;
    }
  },

  async updateStory(
    storyId,
    userId,
    userRole,
    { title, content, coverImage, status, visibility, publishedAt },
  ) {
    try {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        select: { authorId: true },
      });

      if (!story) throw new Error('Story not found');

      let slug = story.title === title ? undefined : await generateUniqueSlug(title, prisma);

      if (userRole === 'AUTHOR' && story.authorId !== userId) {
        throw new Error('Unauthorized to update this story');
      }

      let publishedAtDate = null;

      if (status === 'PUBLISHED') {
        if (publishedAt && !isNaN(new Date(publishedAt).getTime())) {
          publishedAtDate = new Date(publishedAt);
        } else {
          publishedAtDate = new Date();
        }
      }

      const updatedData = {
        title,
        slug,
        content,
        coverImage,
        status,
        visibility,
        publishedAt: publishedAtDate,
      };

      const updatedStory = await prisma.story.update({
        where: { id: storyId },
        data: updatedData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return updatedStory;
    } catch (error) {
      console.log('Error in storyService.updateStory:', error);
      throw error;
    }
  },
  async toggleVisibility(storyId, userId) {
    try {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        select: { authorId: true, visibility: true },
      });
      if (!story) throw new Error('Story not found');
      if (story.authorId !== userId) throw new Error('Unauthorized to update this story');
      const updatedStory = await prisma.story.update({
        where: { id: storyId },
        data: { visibility: story.visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedStory;
    } catch (error) {
      console.log('Error in storyService.toggleVisibility:', error);
      throw error;
    }
  },

  async getAllPublicStories({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  }) {
    try {
      const whereClause = {
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
      };

      if (search) {
        whereClause.OR = [{ title: { contains: search, mode: 'insensitive' } }];
      }

      // TOTAL COUNT CHECK
      const totalStories = await prisma.story.count({ where: whereClause });

      // Agar koi story nahi hai toh yahi se return karo
      if (totalStories === 0) {
        return {
          stories: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNext: false,
            hasPrev: false,
          },
          filters: {
            search: search || '',
            sortBy: sortBy,
            sortOrder: sortOrder,
          },
        };
      }

      const paginationData = paginate({ page, limit }, totalStories);

      const validSortFields = ['publishedAt', 'title', 'createdAt'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'publishedAt';
      const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

      const stories = await prisma.story.findMany({
        where: whereClause,
        skip: paginationData.skip,
        take: paginationData.limit,
        orderBy: { [sortField]: order },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        stories,
        pagination: {
          currentPage: paginationData.page,
          totalPages: paginationData.totalPages,
          totalItems: paginationData.totalCount,
          itemsPerPage: paginationData.limit,
          hasNext: paginationData.hasNext,
          hasPrev: paginationData.hasPrevious,
        },
        filters: {
          search: search || '',
          sortBy: sortField,
          sortOrder: order,
        },
      };
    } catch (error) {
      console.log('Error in storyService.getAllPublicStories:', error);
      throw error;
    }
  },

  async getPublicStoryBySlug(slug) {
    try {
      const story = await prisma.story.findFirst({
        where: {
          slug,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return story;
    } catch (error) {
      console.log('Error in storyService.getPublicStoryBySlug:', error);
      throw error;
    }
  },
};

export default storyService;
