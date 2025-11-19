import storyService from '../service/story.service.js';
import {
  createStorySchema,
  getAllStoriesQuerySchema,
  updateStorySchema,
} from '../validation/story.validation.js';
import { z } from 'zod';

const storyController = {
  async createStory(req, res) {
    try {
      const validatedData = createStorySchema.parse(req.body);
      const autherId = req.user.id;
      const story = await storyService.createStory(validatedData, autherId);
      res.status(201).json({
        message: 'Story created successfully',
        story,
        success: true,
      });
    } catch (error) {
      console.log(error);

      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: error.errors,
        });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getStoryById(req, res) {
    try {
      const { storyId } = req.params;
      const story = await storyService.getStoryById(storyId);
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.status(200).json({
        message: 'Story fetched successfully',
        story,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getStoriesByAuthor(req, res) {
    try {
      const validatedQuery = getAllStoriesQuerySchema.parse(req.query);
      const authorId = req.user.id;
      const stories = await storyService.getStoriesByAuthor(authorId, validatedQuery);
      res.status(200).json({
        message: 'Stories fetched successfully',
        stories: stories.stories,
        pagination: stories.pagination,
        filters: stories.filters,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getAllStories(req, res) {
    try {
      const validatedQuery = getAllStoriesQuerySchema.parse(req.query);
      const result = await storyService.getAllStories(validatedQuery);
      res.status(200).json({
        message: 'Stories fetched successfully',
        data: result.stories,
        pagination: result.pagination,
        filters: result.filters,
        success: true,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: error.errors,
        });
      }

      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteStory(req, res) {
    try {
      const { storyId } = req.params;
      const user = req.user;
      await storyService.deleteStory(storyId, user);
      res.status(200).json({
        message: 'Story deleted successfully',
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async updateStory(req, res) {
    try {
      const { storyId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      const validatedData = updateStorySchema.parse(req.body);

      const updatedStory = await storyService.updateStory(storyId, userId, userRole, validatedData);

      res.status(200).json({
        message: 'Story updated successfully',
        story: updatedStory,
        success: true,
      });
    } catch (error) {
      console.log(error);

      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: error.errors,
        });
      }

      if (error.message === 'Story not found') {
        return res.status(404).json({ success: false, error: 'Story not found' });
      }
      if (error.message === 'Not authorized to update this story') {
        return res
          .status(403)
          .json({ success: false, error: 'You can only edit your own stories' });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateStoryStatus(req, res) {
    try {
      const storyId = req.params.storyId;
      const userId = req.user.id;
      const updatedStory = await storyService.toggleVisibility(storyId, userId);
      return res.status(200).json({
        message: 'Story visibility updated successfully',
        data: updatedStory,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  async getAllPublicStories(req, res) {
    try {
      const result = await storyService.getAllPublicStories(req.query);

      res.status(200).json({
        message: 'Public stories fetched successfully',
        data: result.stories,
        pagination: result.pagination,
        filters: result.filters,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: error.errors,
        });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getPublicStoryBySlug(req, res) {
    try {
      const { slug } = req.params;
      const story = await storyService.getPublicStoryBySlug(slug);
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.status(200).json({
        message: 'Story fetched successfully',
        story,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default storyController;
