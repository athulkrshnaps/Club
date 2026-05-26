import {
  BellRing,
  BookPlus,
  CalendarPlus,
  HeartPulse,
  ImageUp,
  LogIn,
  Send,
  ShieldCheck,
  UsersRound
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  adminAnalytics as demoAnalytics,
  books as demoBooks,
  equipment as demoEquipment,
  events as demoEvents,
  notifications as demoNotifications
} from '../data/demoData';
import { api } from '../lib/api';

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));

export default function AdminDashboard() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(demoAnalytics);
  const [books, setBooks] = useState(demoBooks);
  const [events, setEvents] = useState(demoEvents);
  const [equipment, setEquipment] = useState(demoEquipment);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [bookForm, setBookForm] = useState({ title: '', author: '', category: '', totalCopies: 1 });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'community',
    startsAt: ''
  });
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement',
    audience: 'members'
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!token || !isAdmin) return;

    Promise.all([
      api.get('/admin/analytics', { token }),
      api.get('/books'),
      api.get('/events'),
      api.get('/equipment'),
      api.get('/notifications', { token }),
      api.get('/admin/members', { token })
    ])
      .then(([analyticsResult, bookResult, eventResult, equipmentResult, noteResult, memberResult]) => {
        setAnalytics(analyticsResult.analytics);
        setBooks(bookResult.books);
        setEvents(eventResult.events);
        setEquipment(equipmentResult.equipment);
        setNotifications(noteResult.notifications);
        setMembers(memberResult.members);
      })
      .catch(() => {
        setAnalytics(demoAnalytics);
        setBooks(demoBooks);
        setEvents(demoEvents);
        setEquipment(demoEquipment);
        setNotifications(demoNotifications);
        setMembers([
          { _id: 'member-1', name: 'Akhil Member', phone: '9876543210', membershipId: 'NVA-2026-AKHIL' },
          { _id: 'member-2', name: 'Sneha Volunteer', phone: '9876543211', membershipId: 'NVA-2026-SNEHA' }
        ]);
      });
  }, [token, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <PageShell
        eyebrow="Admin Dashboard"
        title="Admin access required"
        description="Administrators can manage books, events, sports updates, medical equipment, members, notifications, and analytics."
      >
        <section className="container-shell pb-20">
          <Link to="/login" className="btn-primary">
            <LogIn size={18} />
            Admin Login
          </Link>
        </section>
      </PageShell>
    );
  }

  const createBook = async (event) => {
    event.preventDefault();
    const payload = {
      ...bookForm,
      totalCopies: Number(bookForm.totalCopies),
      availableCopies: Number(bookForm.totalCopies)
    };

    try {
      const result = await api.post('/books', payload, { token });
      setBooks((current) => [result.book, ...current]);
      setMessage('Book created.');
      setBookForm({ title: '', author: '', category: '', totalCopies: 1 });
    } catch (error) {
      setMessage(error.message || 'Book could not be created.');
    }
  };

  const createEvent = async (event) => {
    event.preventDefault();

    try {
      const result = await api.post('/events', eventForm, { token });
      setEvents((current) => [result.event, ...current]);
      setMessage('Event created.');
      setEventForm({ title: '', description: '', location: '', type: 'community', startsAt: '' });
    } catch (error) {
      setMessage(error.message || 'Event could not be created.');
    }
  };

  const sendNotification = async (event) => {
    event.preventDefault();

    try {
      const result = await api.post('/notifications', notificationForm, { token });
      setNotifications((current) => [result.notification, ...current]);
      setMessage('Notification sent.');
      setNotificationForm({ title: '', message: '', type: 'announcement', audience: 'members' });
    } catch (error) {
      setMessage(error.message || 'Notification could not be sent.');
    }
  };

  const uploadMedia = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Choose a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await api.post('/uploads/image', formData, { token });
      setMessage(`Uploaded ${result.file.filename}.`);
      setFile(null);
    } catch (error) {
      setMessage(error.message || 'Upload failed.');
    }
  };

  return (
    <PageShell
      eyebrow="Admin Dashboard"
      title="Full control panel for community operations"
      description="Manage books, events, sports updates, medical support inventory, members, notifications, uploads, and analytics."
    >
      <section className="container-shell pb-20">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={UsersRound} label="Members" value={analytics.totalMembers} tone="teal" />
          <MetricCard icon={BookPlus} label="Books" value={analytics.totalBooks} tone="sky" />
          <MetricCard icon={CalendarPlus} label="Upcoming events" value={analytics.upcomingEvents} tone="amber" />
          <MetricCard icon={HeartPulse} label="Emergency requests" value={analytics.emergencyRequests} tone="rose" />
        </div>

        {message && (
          <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">
          <div className="grid gap-8">
            <section className="surface-card">
              <SectionHeader eyebrow="Library admin" title="Manage books" />
              <form onSubmit={createBook} className="mt-5 grid gap-3 md:grid-cols-4">
                <input
                  className="input-field"
                  placeholder="Title"
                  value={bookForm.title}
                  onChange={(event) => setBookForm({ ...bookForm, title: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Author"
                  value={bookForm.author}
                  onChange={(event) => setBookForm({ ...bookForm, author: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Category"
                  value={bookForm.category}
                  onChange={(event) => setBookForm({ ...bookForm, category: event.target.value })}
                />
                <button className="btn-primary" type="submit">
                  <BookPlus size={18} />
                  Add
                </button>
              </form>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="py-3">Book</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">Copies</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {books.slice(0, 6).map((book) => (
                      <tr key={book._id}>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{book.title}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{book.category}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">
                          {book.availableCopies}/{book.totalCopies}
                        </td>
                        <td className="py-3">
                          <StatusBadge tone={book.availableCopies > 0 ? 'success' : 'danger'}>
                            {book.availableCopies > 0 ? 'Available' : 'Out'}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="surface-card">
              <SectionHeader eyebrow="Event management" title="Create upcoming event" />
              <form onSubmit={createEvent} className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  className="input-field"
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
                />
                <input
                  type="datetime-local"
                  className="input-field"
                  value={eventForm.startsAt}
                  onChange={(event) => setEventForm({ ...eventForm, startsAt: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })}
                />
                <select
                  className="input-field"
                  value={eventForm.type}
                  onChange={(event) => setEventForm({ ...eventForm, type: event.target.value })}
                >
                  <option value="community">Community</option>
                  <option value="sports">Sports</option>
                  <option value="library">Library</option>
                  <option value="charity">Charity</option>
                  <option value="medical">Medical</option>
                </select>
                <textarea
                  className="input-field min-h-24 md:col-span-2"
                  placeholder="Description"
                  value={eventForm.description}
                  onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })}
                />
                <button className="btn-primary md:col-span-2" type="submit">
                  <CalendarPlus size={18} />
                  Create Event
                </button>
              </form>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {events.slice(0, 4).map((eventItem) => (
                  <div key={eventItem._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-black text-slate-950 dark:text-white">{eventItem.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(eventItem.startsAt)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-6 xl:sticky xl:top-24 xl:self-start">
            <form onSubmit={sendNotification} className="surface-card">
              <SectionHeader eyebrow="Notifications" title="Send update" />
              <div className="mt-5 grid gap-3">
                <input
                  className="input-field"
                  placeholder="Title"
                  value={notificationForm.title}
                  onChange={(event) =>
                    setNotificationForm({ ...notificationForm, title: event.target.value })
                  }
                />
                <textarea
                  className="input-field min-h-24"
                  placeholder="Message"
                  value={notificationForm.message}
                  onChange={(event) =>
                    setNotificationForm({ ...notificationForm, message: event.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="input-field"
                    value={notificationForm.type}
                    onChange={(event) =>
                      setNotificationForm({ ...notificationForm, type: event.target.value })
                    }
                  >
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="book">Book</option>
                    <option value="charity">Charity</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  <select
                    className="input-field"
                    value={notificationForm.audience}
                    onChange={(event) =>
                      setNotificationForm({ ...notificationForm, audience: event.target.value })
                    }
                  >
                    <option value="members">Members</option>
                    <option value="admins">Admins</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <button className="btn-primary" type="submit">
                  <Send size={18} />
                  Send Notification
                </button>
              </div>
            </form>

            <form onSubmit={uploadMedia} className="surface-card">
              <SectionHeader eyebrow="Media" title="Upload image or video" />
              <div className="mt-5 grid gap-3">
                <input
                  className="input-field"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                <button className="btn-secondary" type="submit">
                  <ImageUp size={18} />
                  Upload Media
                </button>
              </div>
            </form>

            <section className="surface-card">
              <SectionHeader eyebrow="Medical inventory" title="Equipment status" />
              <div className="mt-5 grid gap-3">
                {equipment.map((item) => (
                  <div key={item._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-slate-950 dark:text-white">{item.name}</p>
                      <StatusBadge tone={item.availableUnits > 0 ? 'success' : 'danger'}>
                        {item.availableUnits}/{item.totalUnits}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.type}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-card">
              <SectionHeader eyebrow="Members" title="Recent members" />
              <div className="mt-5 grid gap-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-black text-slate-950 dark:text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {member.membershipId} · {member.phone}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-card">
              <div className="mb-4 flex items-center gap-3">
                <BellRing className="text-amber-600 dark:text-amber-300" size={21} />
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Latest notices</h2>
              </div>
              <div className="grid gap-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-black text-slate-950 dark:text-white">{notification.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-400/20 dark:bg-teal-400/10">
              <div className="flex items-center gap-3 text-teal-800 dark:text-teal-200">
                <ShieldCheck size={22} />
                <p className="font-black">Role-based authorization active</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
