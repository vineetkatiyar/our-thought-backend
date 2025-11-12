import prisma from '../config/prismaClient.js';

const dashboardService = {
  async getAdminStats() {
    const [totalStories, publishedStories, draftStories, totalUsers, authors] = await Promise.all([
      prisma.story.count(),
      prisma.story.count({ where: { status: 'PUBLISHED' } }),
      prisma.story.count({ where: { status: 'DRAFT' } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
    ]);

    return {
      totalStories,
      published: publishedStories,
      drafts: draftStories,
      totalUsers,
      authors,
    };
  },

  async getAdminRecentStories() {
    return await prisma.story.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  },

  async getAuthorStats(authorId) {
    const [totalStories, publishedStories, draftStories] = await Promise.all([
      prisma.story.count({ where: { authorId } }),
      prisma.story.count({
        where: { authorId, status: 'PUBLISHED' },
      }),
      prisma.story.count({
        where: { authorId, status: 'DRAFT' },
      }),
    ]);

    return {
      totalStories,
      published: publishedStories,
      drafts: draftStories,
    };
  },

  async getAuthorRecentStories(authorId) {
    return await prisma.story.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
  },
};

export default dashboardService;
