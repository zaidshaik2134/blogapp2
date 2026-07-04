import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatDate } from '../utils/formatDate.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/blogs');
      setBlogs(data.blogs);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog permanently?')) return;

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
      toast.success('Blog deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-coral">Admin</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Dashboard</h1>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary">
          <Plus size={18} />
          Add Blog
        </Link>
      </div>

      {loading ? <Spinner label="Loading dashboard..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={fetchBlogs} /> : null}
      {!loading && !error && blogs.length === 0 ? <EmptyState /> : null}
      {!loading && !error && blogs.length > 0 ? (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink/[0.04] text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Media</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {blogs.map((blog) => (
                <tr key={blog._id} className="bg-white">
                  <td className="px-4 py-4">
                    <p className="max-w-xs truncate font-bold text-ink">{blog.title}</p>
                    <p className="max-w-xs truncate text-ink/55">{blog.description}</p>
                  </td>
                  <td className="px-4 py-4 capitalize text-ink/70">{blog.mediaType}</td>
                  <td className="px-4 py-4">{blog.likes}</td>
                  <td className="px-4 py-4">{blog.comments?.length || 0}</td>
                  <td className="px-4 py-4">{formatDate(blog.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/blogs/${blog._id}/edit`} className="btn-secondary" aria-label="Edit blog">
                        <Edit size={18} />
                      </Link>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => deleteBlog(blog._id)}
                        aria-label="Delete blog"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};

export default AdminDashboard;
