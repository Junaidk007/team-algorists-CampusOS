const registerNotificationSocket = (socket) => {
  socket.on('subscribe_to_notifications', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} subscribed to notifications for user ${userId}`);
  });
};

module.exports = {
  registerNotificationSocket,
};
