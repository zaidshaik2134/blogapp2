import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaPreview from './MediaPreview.jsx';
import { formatDate } from '../utils/formatDate.js';

const BlogCard = ({ blog, onLike, onShare }) => (
  <article className="panel overflow-hidden">
    <MediaPreview blog={blog} />
    <div className="space-y-4 p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-meadow">
          {formatDate(blog.createdAt)}
        </p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-ink">{blog.title}</h2>
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-ink/70">{blog.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary" onClick={() => onLike(blog)}>
          <Heart size={18} />
          {blog.likes}
        </button>
        <Link to={`/blogs/${blog._id}`} className="btn-secondary">
          <MessageCircle size={18} />
          {blog.comments?.length || 0}
        </Link>
        <button type="button" className="btn-secondary" onClick={() => onShare(blog)}>
          <Share2 size={18} />
          Share
        </button>
        <Link to={`/blogs/${blog._id}`} className="btn-primary ml-auto">
          Read More
        </Link>
      </div>
    </div>
  </article>
);

export default BlogCard;
