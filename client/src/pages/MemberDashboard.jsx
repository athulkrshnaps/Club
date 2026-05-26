import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  Clock3,
  HeartHandshake,
  LogIn,
  QrCode,
  UserCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { events, memberHistory, notifications as demoNotifications } from '../data/demoData';
import { api } from '../lib/api';

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(value))
    : 'Pending';

function MemberQr({ value }) {
  const cells = useMemo(() => {
    const source = value || 'NAVODHAYAM';
    return Array.from({ length: 121 }, (_, index) => {
      const code = source.charCodeAt(index % source.length);
      const isAnchor =
        (index < 33 && index % 11 < 3) ||
        (index > 87 && index % 11 < 3) ||
        (index < 33 && index % 11 > 7);
      return isAnchor || (code + index * 7) % 4 === 0;
    });
  }, [value]);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-950">
      <div className="grid grid-cols-11 gap-1">
        {cells.map((active, index) => (
          <span
            key={`${value}-${index}`}
            className={`aspect-square rounded-sm ${active ? 'bg-slate-950 dark:bg-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function MemberDashboard() {
  const { token, user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState(memberHistory);
  const [notifications, setNotifications] = useState(demoNotifications);

  useEffect(() => {
    if (!token) return;

    Promise.all([api.get('/books/member/history', { token }), api.get('/notifications', { token })])
      .then(([historyResult, notificationResult]) => {
        setHistory(historyResult.reservations);
        setNotifications(notificationResult.notifications);
      })
      .catch(() => {
        setHistory(memberHistory);
        setNotifications(demoNotifications);
      });
  }, [token]);

  if (!isAuthenticated) {
    return (
      <PageShell
        eyebrow="Member Dashboard"
        title="Login required"
        description="Member accounts can access reservations, registrations, notifications, and profile details."
      >
        <section className="container-shell pb-20">
          <Link to="/login" className="btn-primary">
            <LogIn size={18} />
            Login
          </Link>
        </section>
      </PageShell>
    );
  }

  const registeredEvents = events.slice(0, 2);

  return (
    <PageShell
      eyebrow="Member Dashboard"
      title={`Welcome, ${user?.name || 'Member'}`}
      description="Your books, events, notifications, medical support updates, and membership profile are organized here."
    >
      <section className="container-shell pb-20">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={BookOpenCheck} label="Borrow records" value={history.length} tone="teal" />
          <MetricCard icon={CalendarCheck} label="Registered events" value={registeredEvents.length} tone="sky" />
          <MetricCard icon={Bell} label="Notifications" value={notifications.length} tone="amber" />
          <MetricCard icon={HeartHandshake} label="Support requests" value="1" tone="rose" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                  <UserCircle size={30} />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-950 dark:text-white">{user?.name}</p>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {user?.membershipId}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                <p>{user?.phone}</p>
                <p>{user?.email}</p>
                <p>{user?.address}</p>
              </div>
            </div>

            <div className="surface-card">
              <div className="mb-4 flex items-center gap-3">
                <QrCode className="text-teal-700 dark:text-teal-300" size={22} />
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Member ID</h2>
              </div>
              <MemberQr value={user?.membershipId} />
            </div>
          </aside>

          <div className="grid gap-8">
            <section className="surface-card">
              <SectionHeader
                eyebrow="Library"
                title="Reserved and borrowed books"
                description="Current and past library activity from the reservation system."
              />
              <div className="mt-6 grid gap-3">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="grid gap-3 rounded-lg bg-slate-50 p-4 dark:bg-white/5 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">{item.book?.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.book?.author}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={item.status === 'returned' ? 'success' : 'warning'}>
                        {item.status}
                      </StatusBadge>
                      <StatusBadge tone="neutral">Due {formatDate(item.dueAt)}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="surface-card">
                <SectionHeader eyebrow="Events" title="Registrations" />
                <div className="mt-5 grid gap-3">
                  {registeredEvents.map((event) => (
                    <div key={event._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                      <p className="font-black text-slate-950 dark:text-white">{event.title}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock3 size={15} /> {formatDate(event.startsAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card">
                <SectionHeader eyebrow="Notifications" title="Latest updates" />
                <div className="mt-5 grid gap-3">
                  {notifications.slice(0, 4).map((notification) => (
                    <div key={notification._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                      <p className="font-black text-slate-950 dark:text-white">{notification.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
