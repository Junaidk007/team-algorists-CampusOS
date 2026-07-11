const notificationService = require('../services/notification.service');
const ApiResponse = require('../utils/ApiResponse');

const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user.id);
    res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  markRead,
};
