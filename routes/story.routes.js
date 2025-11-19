import { Router } from 'express';
import storyController from '../controllers/story.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Example route for creating a story
router.post(
  '/create',
  authenticateToken,
  requireRole(['AUTHOR', 'ADMIN']),
  storyController.createStory,
);
router.get('/get/:storyId', storyController.getStoryById);
router.get(
  '/author/get/my-stories',
  authenticateToken,
  requireRole(['AUTHOR']),
  storyController.getStoriesByAuthor,
);

router.get(
  '/admin/get/all-story',
  authenticateToken,
  requireRole(['ADMIN']),
  storyController.getAllStories,
);
router.delete(
  '/delete/:storyId',
  authenticateToken,
  requireRole(['ADMIN', 'AUTHOR']),
  storyController.deleteStory,
);
router.put(
  '/update/:storyId',
  authenticateToken,
  requireRole(['ADMIN', 'AUTHOR']),
  storyController.updateStory,
);

router.patch(
  '/update/status/:storyId',
  authenticateToken,
  requireRole(['ADMIN', 'AUTHOR']),
  storyController.updateStoryStatus,
)


// public api
router.get('/public', storyController.getAllPublicStories);
router.get('/:slug', storyController.getPublicStoryBySlug);

export default router;
