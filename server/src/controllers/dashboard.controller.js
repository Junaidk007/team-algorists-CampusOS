const dashboardService = require('../services/dashboard.service');
const aiService = require('../services/ai.service');
const ApiResponse = require('../utils/ApiResponse');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

const getAiSummary = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    const context = `System stats: Users: ${stats.users}, Events: ${stats.events}, Resources: ${stats.resources}, Active Bookings: ${stats.activeBookings}.`;
    const summary = await aiService.generateAIResponse('Analyze the system stats and write a brief overview report with suggestions.', context);
    res.status(200).json(new ApiResponse(200, { summary }, 'AI Dashboard report generated.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAiSummary,
};
