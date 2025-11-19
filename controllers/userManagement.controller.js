import userManagementService from '../service/userManagement.service.js';
import {
  getAllUsersQuerySchema,
  updateUserRoleSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from '../validation/user.validation.js';

const userController = {
  async getUser(req, res) {
    try {
      const vaildateQueryParams = getAllUsersQuerySchema.parse(req.query);
      const result = await userManagementService.getAllUsers(vaildateQueryParams);
      res.status(200).json({
        message: 'Users fetched successfully',
        users: result.users,
        success: true,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getUserId(req, res) {
    try {
      const { userId } = req.params;
      const user = await userManagementService.getUserById(userId);
      res.status(200).json({
        message: 'User details fetched successfully',
        user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status } = updateUserStatusSchema.parse(req.body);
      const user = await userManagementService.updateUserStatus(userId, status);
      res.status(200).json({
        message: 'User status updated successfully',
        user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = updateUserRoleSchema.parse(req.body);

      const user = await userManagementService.updateUserRole(userId, role);
      res.status(200).json({
        message: 'User role updated successfully',
        user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await userManagementService.deleteUser(userId);
      res.status(200).json({
        message: 'User deleted successfully',
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const loggedInUserRole = req.user.role;
      const loggedInUserId = req.user.id;

      if (loggedInUserRole === 'AUTHOR' && loggedInUserId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
      }
      const validateData = updateUserSchema.parse(req.body);
      const user = await userManagementService.updateUser(userId, validateData);
      res.status(200).json({
        message: 'User updated successfully',
        user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default userController;
