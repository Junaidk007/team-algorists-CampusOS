const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const createNotification = async (recipientId, title, message, type = 'info') => {
  const notification = await Notification.create({
    recipient: recipientId,
    title,
    message,
    type,
  });

  try {
    const io = getIO();
    io.to(recipientId.toString()).emit('notification', notification);
  } catch (err) {
    // Socket might not be active, but notifications are persistent in db
  }

  return notification;
};

const getNotificationsForUser = async (userId) => {
  return Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  markAsRead,
};
