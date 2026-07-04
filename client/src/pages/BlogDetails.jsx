import { Heart, Share2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import MediaPreview from '../components/MediaPreview.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatDate } from '../utils/formatDate.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState(() => {
    const stored = localStorage.getItem('liked_blogs');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/blogs/${id}`);
      setBlog(data.blog);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const likeBlog = async () => {
    try {
      const nextLiked = !likedBlogs.includes(id);
      const { data } = await api.post(`/blogs/${id}/like`, { liked: nextLiked });
      const nextLikedBlogs = nextLiked
        ? [...likedBlogs, id]
        : likedBlogs.filter((blogId) => blogId !== id);

      localStorage.setItem('liked_blogs', JSON.stringify(nextLikedBlogs));
      setLikedBlogs(nextLikedBlogs);
      setBlog((current) => ({ ...current, likes: data.likes }));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const shareBlog = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Blog URL copied');
  };

  const addComment = async (values) => {
    try {
      const { data } = await api.post(`/blogs/${id}/comment`, values);
      setBlog((current) => ({ ...current, comments: data.comments }));
      reset();
      toast.success('Comment posted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const removeComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const { data } = await api.delete(`/blogs/${id}/comment/${commentId}`);
      setBlog((current) => ({ ...current, comments: data.comments }));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner label="Loading blog..." />;
  if (error) return <ErrorState message={error} onRetry={fetchBlog} />;

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <Link to="/" className="text-sm font-semibold text-ocean hover:underline">
        Back to blogs
      </Link>
      <div className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-wide text-meadow">{formatDate(blog.createdAt)}</p>
        <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl">{blog.title}</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={likeBlog}>
            <Heart size={18} />
            {blog.likes}
          </button>
          <button type="button" className="btn-secondary" onClick={shareBlog}>
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      <MediaPreview blog={blog} />
      <div className="prose max-w-none whitespace-pre-line text-lg leading-8 text-ink/80">{blog.description}</div>

      <section className="panel p-5">
        <h2 className="text-2xl font-black text-ink">Comments</h2>
        <form onSubmit={handleSubmit(addComment)} className="mt-5 grid gap-4">
          <div>
            <label className="label" htmlFor="username">
              Name
            </label>
            <input
              id="username"
              className="field mt-1"
              {...register('username', { required: 'Name is required', minLength: 2 })}
            />
            {errors.username ? <p className="mt-1 text-sm text-coral">{errors.username.message}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="comment">
              Comment
            </label>
            <textarea
              id="comment"
              rows="4"
              className="field mt-1"
              {...register('comment', { required: 'Comment is required', minLength: 2 })}
            />
            {errors.comment ? <p className="mt-1 text-sm text-coral">{errors.comment.message}</p> : null}
          </div>
          <button type="submit" className="btn-primary justify-self-start" disabled={isSubmitting}>
            Post Comment
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {blog.comments?.length ? (
            blog.comments.map((item) => (
              <div key={item._id} className="rounded-md border border-ink/10 bg-ink/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-ink">{item.username}</p>
                    <p className="text-xs text-ink/50">{formatDate(item.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    className="text-coral hover:text-coral/80"
                    onClick={() => removeComment(item._id)}
                    aria-label="Delete comment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{item.comment}</p>
              </div>
            ))
          ) : (
            <p className="rounded-md bg-ink/[0.03] p-4 text-sm text-ink/60">No comments yet.</p>
          )}
        </div>
      </section>
    </article>
  );
};

export default BlogDetails;
