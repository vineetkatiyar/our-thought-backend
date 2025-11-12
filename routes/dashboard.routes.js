import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

// Admin routes
router.get(
  '/admin/stats',
  authenticateToken,
  requireRole(['ADMIN']),
  dashboardController.getAdminStats,
);

// Author routes
router.get(
  '/author/stats',
  authenticateToken,
  requireRole(['AUTHOR']),
  dashboardController.getAuthorStats,
);

export default router;
