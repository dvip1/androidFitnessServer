import userController from '../controller/userController.js';
import express from 'express';
const router = express.Router();

router.route('/add').post(userController.addUserInfo);
router.route('/exist/:username').get(userController.isUsername);
router.route('/profile/:uid').get(userController.getUserProfile);
router.route('/sync-token').post(userController.syncDeviceToken);

export default router;
