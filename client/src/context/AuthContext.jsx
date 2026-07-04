import { useMemo, useState } from 'react';
import api from '../api/axios.js';
import { AuthContext } from './authContextValue.js';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('blog_admin_token'));
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('blog_admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('blog_admin_token', data.token);
    localStorage.setItem('blog_admin', JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    localStorage.setItem('blog_admin_token', data.token);
    localStorage.setItem('blog_admin', JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('blog_admin_token');
    localStorage.removeItem('blog_admin');
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [admin, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
