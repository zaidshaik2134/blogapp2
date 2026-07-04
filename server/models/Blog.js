import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [60, 'Username cannot exceed 60 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [2, 'Comment must be at least 2 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    mediaType: {
      type: String,
      enum: ['none', 'image', 'gif', 'video', 'external'],
      default: 'none',
    },
    mediaUrl: {
      type: String,
      trim: true,
      default: '',
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [commentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true },
);

blogSchema.index({ title: 'text', description: 'text' });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
