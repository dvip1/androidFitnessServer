import notificationController from '../controller/notificationController.js';
import express from 'express';
const router = express.Router();

router.post('/', notificationController.createAndSendNotification);
router.get('/:userId', notificationController.getUserNotifications);
router.patch('/:userId/read', notificationController.markAsRead);
router.delete('/:userId', notificationController.deleteNotifications);
router.post('/friend', notificationController.sendFriendRequest);

export default router;
