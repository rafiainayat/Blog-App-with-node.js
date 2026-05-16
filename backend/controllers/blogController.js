const Blog = require('../models/Blog');
const cloudinary = require('cloudinary').v2;

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      image: req.file ? req.file.path : null,
      imagePublicId: req.file ? req.file.filename : null,
    });

    await newBlog.save();
    res.status(201).json({
      message: 'Blog created successfully',
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const { title, content } = req.body;

    // Delete old image if new image is uploaded
    if (req.file && blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    if (req.file) {
      blog.image = req.file.path;
      blog.imagePublicId = req.file.filename;
    }

    await blog.save();

    res.status(200).json({
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    // Delete image from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
