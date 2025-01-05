import postController from '../controller/postController.js';
import express from 'express';
const router = express.Router();

router.route('/add').post(postController.createPost);
router.route('/get/').get(postController.getPost);

export default router;
