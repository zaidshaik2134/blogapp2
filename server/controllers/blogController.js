import fs from 'fs';
import path from 'path';
import Blog from '../models/Blog.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const buildAbsoluteUrl = (req, relativePath) => {
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}${relativePath}`;
};

const deleteUploadedFile = (mediaUrl) => {
  if (!mediaUrl || !mediaUrl.includes('/uploads/')) {
    return;
  }

  const filename = mediaUrl.split('/uploads/').pop();
  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.promises.unlink(filePath).catch(() => {});
};

const resolveMedia = (req, currentMediaUrl = '') => {
  const { mediaType = 'none', mediaUrl = '' } = req.body;

  if (req.file) {
    if (currentMediaUrl) {
      deleteUploadedFile(currentMediaUrl);
    }

    return {
      mediaType: 'image',
      mediaUrl: buildAbsoluteUrl(req, `/uploads/${req.file.filename}`),
    };
  }

  if (mediaType === 'none') {
    return { mediaType: 'none', mediaUrl: '' };
  }

  return {
    mediaType,
    mediaUrl: mediaUrl.trim(),
  };
};

export const getBlogs = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const blogs = await Blog.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    blogs,
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy', 'name email');

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const media = resolveMedia(req);

  const blog = await Blog.create({
    title,
    description,
    ...media,
    createdBy: req.admin._id,
  });

  res.status(201).json({
    success: true,
    blog,
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const media = resolveMedia(req, blog.mediaUrl);
  blog.title = req.body.title ?? blog.title;
  blog.description = req.body.description ?? blog.description;
  blog.mediaType = media.mediaType;
  blog.mediaUrl = media.mediaUrl;

  await blog.save();

  res.status(200).json({
    success: true,
    blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  deleteUploadedFile(blog.mediaUrl);
  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});

export const toggleLikeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const liked = req.body?.liked !== false;
  blog.likes = liked ? blog.likes + 1 : Math.max(blog.likes - 1, 0);
  await blog.save();

  res.status(200).json({
    success: true,
    liked,
    likes: blog.likes,
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  blog.comments.push({
    username: req.body.username,
    comment: req.body.comment,
  });
  await blog.save();

  res.status(201).json({
    success: true,
    comments: blog.comments,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const comment = blog.comments.id(req.params.commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  comment.deleteOne();
  await blog.save();

  res.status(200).json({
    success: true,
    comments: blog.comments,
  });
});
