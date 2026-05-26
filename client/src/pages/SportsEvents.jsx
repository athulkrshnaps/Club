import { CalendarCheck, CalendarDays, Camera, MapPin, Trophy, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { events as demoEvents, galleryImages, sportsUpdates as demoSports } from '../data/demoData';
import { api } from '../lib/api';

const tabs = ['all', 'sports', 'library', 'medical', 'community'];

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));

export default function SportsEvents() {
  const { token, isAuthenticated } = useAuth();
  const [events, setEvents] = useState(demoEvents);
  const [sportsUpdates, setSportsUpdates] = useState(demoSports);
  const [activeTab, setActiveTab] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.get('/events?upcoming=true'), api.get('/sports')])
      .then(([eventResult, sportsResult]) => {
        setEvents(eventResult.events);
        setSportsUpdates(sportsResult.updates);
      })
      .catch(() => {
        setEvents(demoEvents);
        setSportsUpdates(demoSports);
      });
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === 'all') return events;
    return events.filter((event) => event.type === activeTab);
  }, [activeTab, events]);

  const register = async (eventItem) => {
    if (!isAuthenticated) {
      setMessage('Please login to register for events.');
      return;
    }

    try {
      await api.post(`/events/${eventItem._id}/register`, {}, { token });
      setMessage(`Registration confirmed for ${eventItem.title}.`);
    } catch (error) {
      setMessage(error.message || 'Registration could not be completed.');
    }
  };

  return (
    <PageShell
      eyebrow="Sports & Events"
      title="Tournament announcements, match schedules, registrations, and galleries"
      description="Keep the energy of the club moving with sports updates, community calendars, online registrations, and event memories."
    >
      <section className="container-shell pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-black capitalize transition ${
                    activeTab === tab
                      ? 'bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {message && (
              <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200">
                {message}
              </div>
            )}

            <div className="mt-6 grid gap-5">
              {filteredEvents.map((eventItem) => (
                <article
                  key={eventItem._id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-slate-900 md:grid md:grid-cols-[240px_1fr]"
                >
                  <img src={eventItem.imageUrl} alt="" className="h-56 w-full object-cover md:h-full" />
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={eventItem.type === 'sports' ? 'info' : eventItem.type === 'medical' ? 'danger' : 'success'}>
                        {eventItem.type}
                      </StatusBadge>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <CalendarDays size={14} /> {formatDate(eventItem.startsAt)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">
                      {eventItem.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {eventItem.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={15} /> {eventItem.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <UsersRound size={15} /> {eventItem.registrations?.length || 0}/
                        {eventItem.capacity || 'Open'}
                      </span>
                    </div>
                    <button type="button" onClick={() => register(eventItem)} className="btn-primary mt-5">
                      <CalendarCheck size={18} />
                      Register
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="mt-6">
                <EmptyState message="No events are available in this category." />
              </div>
            )}
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card">
              <SectionHeader
                eyebrow="Sports updates"
                title="Match desk"
                description="Schedules, scores, coaching slots, and tournament highlights."
              />
              <div className="mt-5 grid gap-4">
                {sportsUpdates.map((update) => (
                  <div key={update._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950 dark:text-white">{update.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {update.sport} · {update.venue}
                        </p>
                      </div>
                      {update.isHighlight && <Trophy className="shrink-0 text-amber-500" size={20} />}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {update.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {update.scheduleAt && <StatusBadge tone="info">{formatDate(update.scheduleAt)}</StatusBadge>}
                      {update.score && <StatusBadge tone="warning">{update.score}</StatusBadge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                  <Camera size={21} />
                </div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Event Gallery</h2>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {galleryImages.map((image) => (
                  <img
                    key={image.url}
                    src={image.url}
                    alt={image.title}
                    className="aspect-square rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
