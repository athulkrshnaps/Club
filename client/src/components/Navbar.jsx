import {
  BookOpen,
  HeartHandshake,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  Trophy,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Sports & Events', path: '/sports-events', icon: Trophy },
  { label: 'Charity & Medical', path: '/charity-medical', icon: HeartHandshake }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const dashboardPath = isAdmin ? '/admin' : '/member';

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/45 bg-white/82 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-700 text-sm font-black text-white shadow-glow dark:bg-teal-400 dark:text-slate-950">
            NV
          </span>
          <span className="hidden text-sm font-black uppercase leading-tight text-slate-950 sm:block dark:text-white">
            NAVODHAYAM
            <span className="block text-[11px] font-bold text-teal-700 dark:text-teal-300">
              Vayanashala Amarakuni
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkClass}>
              <span className="flex items-center gap-2">
                <Icon size={16} />
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="btn-secondary px-4 py-2.5">
                <LayoutDashboard size={17} />
                Dashboard
              </Link>
              <button type="button" onClick={logout} className="btn-secondary px-4 py-2.5">
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-4 py-2.5">
              <LogIn size={17} />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-800 lg:hidden dark:border-white/10 dark:text-white"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-soft lg:hidden dark:border-white/10 dark:bg-slate-950">
          <div className="grid gap-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink key={path} to={path} className={linkClass} onClick={() => setOpen(false)}>
                <span className="flex items-center gap-2">
                  <Icon size={16} />
                  {label}
                </span>
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={toggleTheme} className="btn-secondary py-2.5">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                Theme
              </button>
              {isAuthenticated ? (
                <Link to={dashboardPath} className="btn-primary py-2.5" onClick={() => setOpen(false)}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary py-2.5" onClick={() => setOpen(false)}>
                  <LogIn size={17} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
