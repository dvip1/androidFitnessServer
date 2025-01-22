import communityController from '../controller/communityController.js';
import express from 'express';
const router = express.Router();

router.route('/add').post(communityController.createCommunity);
router.route("/user/").get(communityController.getUserCommunity);

export default router;

