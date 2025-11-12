import dashboardService from '../service/dashboard.service.js';

const dashboardController = {
  async getAdminStats(req, res) {
    try {
      const stats = await dashboardService.getAdminStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAuthorStats(req, res) {
    try {
      const authorId = req.user.id;
      const stats = await dashboardService.getAuthorStats(authorId);
      res.status(200).json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default dashboardController;
