import { yupResolver } from '@hookform/resolvers/yup';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../context/useAuth.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-ocean text-white">
            <Lock size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-ink">Admin Login</h1>
            <p className="text-sm text-ink/60">Manage your blog posts.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="field mt-1" {...register('email')} />
            {errors.email ? <p className="mt-1 text-sm text-coral">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input id="password" type="password" className="field mt-1" {...register('password')} />
            {errors.password ? <p className="mt-1 text-sm text-coral">{errors.password.message}</p> : null}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
