import NotificationService from '../service/notificationService.js';

const notificationController = {
  async createAndSendNotification(req, res) {
    const result = await NotificationService.createAndSendNotification(req.body);
    res.status(result.success ? 200 : 400).json(result);
  },

  async getUserNotifications(req, res) {
    const { userId } = req.params;
    const options = req.query;
    const result = await NotificationService.getUserNotifications(userId, options);
    res.status(result.success ? 200 : 400).json(result);
  },

  async markAsRead(req, res) {
    const { userId } = req.params;
    const { notificationIds } = req.body;
    const result = await NotificationService.markAsRead(userId, notificationIds);
    res.status(result.success ? 200 : 400).json(result);
  },

  async deleteNotifications(req, res) {
    const { userId } = req.params;
    const { notificationIds } = req.body;
    const result = await NotificationService.deleteNotifications(userId, notificationIds);
    res.status(result.success ? 200 : 400).json(result);
  },

  async sendFriendRequest(req, res) {
    // Assuming it's just a custom wrapper around createAndSendNotification with type = 'friend_request'
    const result = await NotificationService.createAndSendNotification({
      ...req.body,
      type: 'friend_request',
    });
    res.status(result.success ? 200 : 400).json(result);
  },
};

export default notificationController;
