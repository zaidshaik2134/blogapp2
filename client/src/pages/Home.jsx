import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import BlogCard from '../components/BlogCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [likedBlogs, setLikedBlogs] = useState(() => {
    const stored = localStorage.getItem('liked_blogs');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/blogs', { params: { search } });
      setBlogs(data.blogs);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchBlogs, 250);
    return () => clearTimeout(timeout);
  }, [fetchBlogs]);

  const handleLike = async (blog) => {
    try {
      const nextLiked = !likedBlogs.includes(blog._id);
      const { data } = await api.post(`/blogs/${blog._id}/like`, { liked: nextLiked });
      const nextLikedBlogs = nextLiked
        ? [...likedBlogs, blog._id]
        : likedBlogs.filter((blogId) => blogId !== blog._id);

      localStorage.setItem('liked_blogs', JSON.stringify(nextLikedBlogs));
      setLikedBlogs(nextLikedBlogs);
      setBlogs((current) =>
        current.map((item) => (item._id === blog._id ? { ...item, likes: data.likes } : item)),
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleShare = async (blog) => {
    const url = `${window.location.origin}/blogs/${blog._id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Blog URL copied');
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-coral">Latest first</p>
          <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Explore the blog</h1>
        </div>
        <label className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" size={18} />
          <input
            className="field pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or description"
          />
        </label>
      </div>

      {loading ? <Spinner label="Loading blogs..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={fetchBlogs} /> : null}
      {!loading && !error && blogs.length === 0 ? (
        <EmptyState title="No blogs found" message="Try another search or check back after an admin publishes." />
      ) : null}
      {!loading && !error && blogs.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onLike={handleLike} onShare={handleShare} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default Home;
