import { yupResolver } from '@hookform/resolvers/yup';
import { ImageUp, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';

const schema = yup.object({
  title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  mediaType: yup.string().oneOf(['none', 'image', 'gif', 'video', 'external']).required(),
  mediaUrl: yup.string().when('mediaType', {
    is: (value) => ['gif', 'video', 'external'].includes(value),
    then: (rule) => rule.url('Enter a valid URL with https://').required('Media URL is required'),
    otherwise: (rule) => rule.optional(),
  }),
});

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      mediaType: 'none',
      mediaUrl: '',
    },
  });
  const mediaType = watch('mediaType');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const { data } = await api.get(`/blogs/${id}`);
        reset({
          title: data.blog.title,
          description: data.blog.description,
          mediaType: data.blog.mediaType || 'none',
          mediaUrl: data.blog.mediaType === 'image' ? '' : data.blog.mediaUrl || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isEditing, reset]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('mediaType', values.mediaType);

      if (values.mediaType === 'image' && values.image?.[0]) {
        formData.append('image', values.image[0]);
      } else {
        formData.append('mediaUrl', values.mediaUrl || '');
      }

      if (isEditing) {
        await api.put(`/blogs/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Blog updated');
      } else {
        await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Blog created');
      }

      navigate('/admin');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner label="Loading form..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/admin" className="text-sm font-semibold text-ocean hover:underline">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-4xl font-black text-ink">{isEditing ? 'Edit Blog' : 'Create Blog'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-6">
        <div>
          <label className="label" htmlFor="title">
            Title
          </label>
          <input id="title" className="field mt-1" {...register('title')} />
          {errors.title ? <p className="mt-1 text-sm text-coral">{errors.title.message}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea id="description" rows="8" className="field mt-1" {...register('description')} />
          {errors.description ? <p className="mt-1 text-sm text-coral">{errors.description.message}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="mediaType">
            Media Type
          </label>
          <select id="mediaType" className="field mt-1" {...register('mediaType')}>
            <option value="none">None</option>
            <option value="image">Upload Image</option>
            <option value="gif">GIF URL</option>
            <option value="video">Video URL</option>
            <option value="external">External URL</option>
          </select>
        </div>

        {mediaType === 'image' ? (
          <div>
            <label className="label" htmlFor="image">
              Upload Image
            </label>
            <label className="mt-1 flex cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-ink/25 bg-ink/[0.02] px-4 py-8 text-sm font-semibold text-ink/65">
              <ImageUp size={22} />
              Choose an image
              <input id="image" type="file" accept="image/*" className="sr-only" {...register('image')} />
            </label>
          </div>
        ) : null}

        {['gif', 'video', 'external'].includes(mediaType) ? (
          <div>
            <label className="label" htmlFor="mediaUrl">
              Media URL
            </label>
            <input id="mediaUrl" className="field mt-1" placeholder="https://example.com/media" {...register('mediaUrl')} />
            {errors.mediaUrl ? <p className="mt-1 text-sm text-coral">{errors.mediaUrl.message}</p> : null}
          </div>
        ) : null}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          <Save size={18} />
          {isEditing ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </section>
  );
};

export default BlogForm;
