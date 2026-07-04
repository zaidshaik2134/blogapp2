import '../config/env.js';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Blog from '../models/Blog.js';
import connectDB from '../config/db.js';

const sampleBlogs = [
  {
    title: 'Designing APIs that feel calm to use',
    description:
      'A practical look at predictable REST endpoints, validation, error messages, and why consistent response shapes make frontend work smoother.',
    mediaType: 'external',
    mediaUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
  },
  {
    title: 'Shipping a MERN dashboard with confidence',
    description:
      'Production readiness comes from boring decisions done well: clear boundaries, environment-based configuration, error handling, and small reusable modules.',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
  },
  {
    title: 'Why responsive UI starts with content',
    description:
      'Layouts become easier when the app respects the real content first: readable cards, sensible spacing, and states for loading, empty, and error screens.',
    mediaType: 'gif',
    mediaUrl: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
  },
];

const seed = async () => {
  await connectDB();

  await Admin.deleteMany({ email: 'admin@example.com' });
  const admin = await Admin.create({
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'password123',
  });

  await Blog.deleteMany({});
  await Blog.insertMany(sampleBlogs.map((blog) => ({ ...blog, createdBy: admin._id })));

  console.log('Seed complete');
  console.log('Demo admin: admin@example.com / password123');
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
