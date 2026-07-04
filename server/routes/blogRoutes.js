import express from 'express';
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getBlogById,
  getBlogs,
  toggleLikeBlog,
  updateBlog,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  blogIdRules,
  blogRules,
  commentRules,
  deleteCommentRules,
  likeRules,
} from '../middleware/validators.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', blogIdRules, validateRequest, getBlogById);
router.post('/', protect, uploadSingleImage, blogRules, validateRequest, createBlog);
router.put('/:id', protect, uploadSingleImage, blogIdRules, blogRules, validateRequest, updateBlog);
router.delete('/:id', protect, blogIdRules, validateRequest, deleteBlog);
router.post('/:id/like', likeRules, validateRequest, toggleLikeBlog);
router.post('/:id/comment', commentRules, validateRequest, addComment);
router.delete('/:id/comment/:commentId', deleteCommentRules, validateRequest, deleteComment);

export default router;
