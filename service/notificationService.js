import firebaseAdmin from '../configs/firebaseAdmin.js';
import userModel from '../models/userSchema.js';
import notificationSchema from '../models/notificationSchema.js';

class NotificationService {
  /**
   * Create a notification and send it through FCM
   * @param {Object} params Notification parameters
   * @returns {Promise} Result of the operation
   */
  static async createAndSendNotification({
    recipientUsername,
    senderUserId = null,
    title,
    body,
    data = {},
    type = 'other',
  }) {
    try {
      // 1. Find recipient user
      const recipient = await userModel.findOne({ username: recipientUsername });
      if (!recipient) {
        return { success: false, message: 'Recipient not found' };
      }

      // 2. Create notification document in DB
      const notification = new notificationSchema({
        recipient: recipient._id,
        sender: senderUserId,
        title,
        body,
        data,
        type,
      });

      await notification.save();

      // 3. Send push notification if user has device tokens
      let fcmResult = { success: false, message: 'No device tokens available' };

      if (recipient.device_tokens && recipient.device_tokens.length > 0) {
        fcmResult = await this.sendFCMNotification({
          tokens: recipient.device_tokens,
          title,
          body,
          data: {
            ...data,
            notification_id: notification._id.toString(),
          },
        });

        // 4. Update notification as delivered if successful
        if (fcmResult.success && fcmResult.successCount > 0) {
          notification.delivered = true;
          await notification.save();
        }
      }

      return {
        success: true,
        notification: notification,
        fcmResult: fcmResult,
      };
    } catch (error) {
      console.error('Error in createAndSendNotification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send FCM notification to specified tokens
   * @param {Object} params FCM parameters
   * @returns {Promise} FCM result
   */
  static async sendFCMNotification({ tokens, title, body, data = {} }) {
    try {
      if (!tokens || tokens.length === 0) {
        return { success: false, message: 'No tokens provided' };
      }

      const message = {
        notification: { title, body },
        data: data,
        tokens: tokens,
      };

      const response = await firebaseAdmin.messaging().sendEachForMulticast(message);

      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });

        // Clean up failed tokens
        if (failedTokens.length > 0) {
          await userModel.updateMany(
            { device_tokens: { $in: failedTokens } },
            { $pullAll: { device_tokens: failedTokens } }
          );
        }
      }

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Error in sendFCMNotification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get notifications for a user
   * @param {String} userId User ID
   * @param {Object} options Query options
   * @returns {Promise} List of notifications
   */
  static async getUserNotifications(userId, options = {}) {
    const {
      limit = 20,
      page = 1,
      read = null,
      type = null,
      sort = { createdAt: -1 }, // Latest first by default
    } = options;

    const query = { recipient: userId };

    // Add optional filters
    if (read !== null) query.read = read;
    if (type) query.type = type;

    try {
      const notifications = await notificationSchema
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', 'username profileImage');

      const total = await notificationSchema.countDocuments(query);

      return {
        success: true,
        notifications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notifications as read
   * @param {String} userId User ID
   * @param {Array|String} notificationIds ID(s) to mark as read
   * @returns {Promise} Operation result
   */
  static async markAsRead(userId, notificationIds) {
    try {
      // If notificationIds is not provided, mark all as read
      if (!notificationIds) {
        const result = await notificationSchema.updateMany(
          { recipient: userId, read: false },
          { $set: { read: true } }
        );

        return {
          success: true,
          message: `Marked ${result.modifiedCount} notifications as read`,
        };
      }

      // Convert single ID to array if needed
      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

      const result = await notificationSchema.updateMany(
        {
          _id: { $in: ids },
          recipient: userId, // Security check to ensure user owns these notifications
        },
        { $set: { read: true } }
      );

      return {
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete notifications
   * @param {String} userId User ID
   * @param {Array|String} notificationIds ID(s) to delete
   * @returns {Promise} Operation result
   */
  static async deleteNotifications(userId, notificationIds) {
    try {
      // Convert single ID to array if needed
      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

      const result = await notificationSchema.deleteMany({
        _id: { $in: ids },
        recipient: userId, // Security check
      });

      return {
        success: true,
        message: `Deleted ${result.deletedCount} notifications`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default NotificationService;
