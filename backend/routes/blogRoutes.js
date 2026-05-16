const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes (require authentication)
router.post('/', protect, upload.single('image'), createBlog);
router.get('/user/my-blogs', protect, getUserBlogs);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
