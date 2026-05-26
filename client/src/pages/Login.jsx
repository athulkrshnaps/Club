import { KeyRound, LibraryBig, Lock, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, login } = useAuth();
  const [mode, setMode] = useState('member');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('Member@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/member');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setIdentifier(nextMode === 'admin' ? 'admin@navodhayam.org' : '9876543210');
    setPassword(nextMode === 'admin' ? 'Admin@12345' : 'Member@12345');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ identifier, password });
      navigate(result.user.role === 'admin' ? '/admin' : '/member');
    } catch (loginError) {
      setError(loginError.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-20 dark:bg-slate-950">
      <section className="container-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
              <KeyRound size={22} />
            </div>
            <div>
              <p className="eyebrow">Secure access</p>
              <h1 className="text-3xl font-black text-slate-950 dark:text-white">Login</h1>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-white/5">
            {['member', 'admin'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => switchMode(item)}
                className={`rounded-lg px-4 py-3 text-sm font-black capitalize transition ${
                  mode === item
                    ? 'bg-white text-teal-800 shadow-sm dark:bg-slate-950 dark:text-teal-200'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="relative block">
              {mode === 'admin' ? (
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              ) : (
                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              )}
              <input
                className="input-field pl-11"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={mode === 'admin' ? 'Admin email or phone' : 'Member phone number'}
              />
            </label>
            <label className="relative block">
              <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="input-field pl-11"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </label>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              <UserRound size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            New members can be added from the admin dashboard or through the member registration API.
          </p>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-lg shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/84 via-slate-950/62 to-amber-900/36" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-bold backdrop-blur">
              <LibraryBig size={16} />
              NAVODHAYAM VAYANASHALA AMARAKUNI
            </div>
            <h2 className="mt-5 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              Trusted access for admins, members, volunteers, and community services.
            </h2>
            <Link to="/" className="mt-6 inline-flex items-center text-sm font-black text-teal-100">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
