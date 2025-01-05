import communityController from '../controller/communityController.js';
import express from 'express';
const router = express.Router();

router.route('/add').post(communityController.createCommunity);

export default router;
