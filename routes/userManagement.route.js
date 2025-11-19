import userController from '../controllers/userManagement.controller.js';
import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get(`/all/users`, authenticateToken, requireRole(['ADMIN']), userController.getUser);
router.get(
  '/user/details/:userId',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getUserId,
);

router.patch(
  `/update/users/:userId/status`,
  authenticateToken,
  requireRole(['ADMIN']),
  userController.updateUserStatus,
);

router.patch(
  `/update/users/:userId/role`,
  authenticateToken,
  requireRole(['ADMIN']),
  userController.updateUserRole,
);

router.delete(
  `/delete/users/:userId`,
  authenticateToken,
  requireRole(['ADMIN']),
  userController.deleteUser,
);

router.patch(
  `/update/users/:userId`,
  authenticateToken,
  requireRole(['ADMIN', 'AUTHOR']),
  userController.updateUser,
);


export default router;
