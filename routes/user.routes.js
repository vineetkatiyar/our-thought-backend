import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// router.get('/get/:id', userController.getUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', authenticateToken, userController.getCurrentUser);

export default router;
