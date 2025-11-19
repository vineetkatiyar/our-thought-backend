import prisma from '../config/prismaClient.js';
import { paginate } from '../utils/pagination.js';

const userManagementService = {
  async getAllUsers(vaildateQueryParams) {
    try {
      const {
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = Number(page) || 1,
        limit = Number(limit) || 10,
        role,
        status,
      } = vaildateQueryParams;

      let whereClause = {};

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (role) {
        whereClause.role = role;
      }
      if (status) {
        whereClause.status = status;
      }

      const totalCount = await prisma.user.count({ where: whereClause });

      const {
        skip,
        limit: itemsPerPage,
        page: currentPage,
        totalPages,
        hasPrevious,
        hasNext,
      } = paginate({ page, limit }, totalCount);

      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: itemsPerPage,
      });

      return {
        users,
        pagination: {
          currentPage,
          itemsPerPage,
          totalPages,
          totalItems: totalCount,
          hasPrevious,
          hasNext,
        },
        filters: {
          search: search || null,
          role: role || null,
          status: status || null,
          sortBy,
          sortOrder,
        },
      };
    } catch (error) {
      console.log('Error fetching users:', error);
      throw error;
    }
  },
  async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user;
    } catch (error) {
      console.log('Error fetching user by ID:', error);
      throw error;
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true, role: true, visibility: true },
      });
      return user;
    } catch (error) {
      console.log('Error updating user status:', error);
      throw error;
    }
  },

  async updateUserRole(userId, role) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, name: true, email: true, status: true, role: true, visibility: true },
      });
      return user;
    } catch (error) {
      console.log('Error updating user role:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const user = await prisma.user.delete({ where: { id: userId } });
      return user;
    } catch (error) {
      console.log('Error deleting user:', error);
      throw error;
    }
  },

  async updateUser(userId, updateData) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
          visibility: true,
          bio: true,
          avatar: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.log('Error updating user:', error);
      throw error;
    }
  },
};

export default userManagementService;
