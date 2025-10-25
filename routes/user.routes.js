import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

// router.get('/get/:id', userController.getUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
