import { BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-black text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ocean text-white">
              <BookOpen size={20} />
            </span>
            MERN Blog
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className="btn-secondary">
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/admin" className="btn-secondary">
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>
                <button type="button" className="btn-secondary" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/admin/register" className="btn-secondary">
                  Register
                </NavLink>
                <NavLink to="/admin/login" className="btn-primary">
                  Admin Login
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
