import { yupResolver } from '@hookform/resolvers/yup';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../context/useAuth.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const AdminRegister = () => {
  const { isAuthenticated, register: registerAdmin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (formValues) => {
    const values = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    };

    try {
      await registerAdmin(values);
      toast.success('Admin account created');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-meadow text-white">
            <UserPlus size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-ink">Admin Register</h1>
            <p className="text-sm text-ink/60">Create an account to publish and manage blogs.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" type="text" className="field mt-1" {...register('name')} />
            {errors.name ? <p className="mt-1 text-sm text-coral">{errors.name.message}</p> : null}
          </div>
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
          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="field mt-1"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-sm text-coral">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            Register
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-ink/65">
          Already have an account?{' '}
          <Link to="/admin/login" className="font-bold text-ocean hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminRegister;
