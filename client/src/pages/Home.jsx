import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import {
  announcements,
  books,
  equipment,
  events,
  heroImage,
  homeStats,
  moduleCards,
  sportsUpdates
} from '../data/demoData';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));

export default function Home() {
  const upcomingEvents = events.slice(0, 3);
  const libraryHighlights = books.slice(0, 3);
  const charityHighlights = equipment.filter((item) => item.isEmergencyReady).slice(0, 3);

  return (
    <main className="overflow-hidden bg-slate-50 dark:bg-slate-950">
      <section className="relative isolate flex min-h-[86svh] items-end pt-20 text-white">
        <img src={heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/88 via-teal-950/68 to-amber-950/36" />
        <div className="container-shell grid gap-8 pb-12 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-bold backdrop-blur">
              <Sparkles size={16} />
              Community library, sports, charity and medical support
            </div>
            <h1 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[1.04] sm:text-6xl lg:text-7xl">
              NAVODHAYAM VAYANASHALA AMARAKUNI
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
              A welcoming local platform for reading, learning, tournaments, events, volunteer
              action, medical support, and member services.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/library" className="btn-primary bg-white text-teal-900 hover:bg-teal-50">
                <BookOpen size={18} />
                Explore Library
              </Link>
              <Link
                to="/charity-medical"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18"
              >
                <HeartHandshake size={18} />
                Medical Support
              </Link>
            </div>
          </div>

          <div className="glass-panel animate-float-soft rounded-lg p-5 text-slate-950 dark:text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">
                  Emergency Notice
                </p>
                <h2 className="mt-2 text-2xl font-black">Medical support desk active</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">
                <AlertTriangle size={22} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Wheelchairs, medical beds, nebulizers, and oxygen concentrators can be requested
              through the charity support desk.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {charityHighlights.slice(0, 2).map((item) => (
                <div key={item._id} className="rounded-lg bg-white/75 p-3 dark:bg-white/8">
                  <p className="text-sm font-black">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.availableUnits}/{item.totalUnits} available
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell -mt-8 relative z-10">
        <div className="grid gap-3 rounded-lg border border-white/60 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
          {homeStats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-slate-50 p-5 dark:bg-white/5">
              <p className="text-3xl font-black text-slate-950 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-20">
        <SectionHeader
          eyebrow="Main sections"
          title="A single home for club services"
          description="Members can discover books, register for community programs, follow sports updates, and request medical support from one organized platform."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {moduleCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="What's coming"
              title="Events, announcements, and community updates"
              description="The home page keeps members close to registrations, notices, sports highlights, and urgent community messages."
            />
            <div className="mt-8 rounded-lg border border-rose-200 bg-rose-50 p-5 dark:border-rose-400/20 dark:bg-rose-400/10">
              <div className="flex items-center gap-3 text-rose-800 dark:text-rose-200">
                <ShieldCheck size={22} />
                <p className="font-black">Emergency support line: +91 98765 43210</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-rose-700 dark:text-rose-200/80">
                For urgent medical equipment needs, contact the support desk and submit a request
                through the platform.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {upcomingEvents.map((event) => (
              <Link
                key={event._id}
                to="/sports-events"
                className="group grid overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-slate-950 sm:grid-cols-[190px_1fr]"
              >
                <img src={event.imageUrl} alt="" className="h-48 w-full object-cover sm:h-full" />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={event.type === 'sports' ? 'info' : event.type === 'medical' ? 'danger' : 'success'}>
                      {event.type}
                    </StatusBadge>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {formatDate(event.startsAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {event.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
                    Register or view details <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="surface-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                <BookOpen size={21} />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Library Highlights</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {libraryHighlights.map((book) => (
                <div key={book._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                  <p className="font-bold text-slate-900 dark:text-white">{book.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
                <Trophy size={21} />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Sports Highlights</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {sportsUpdates.map((update) => (
                <div key={update._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                  <p className="font-bold text-slate-900 dark:text-white">{update.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {update.sport} · {update.venue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                <Bell size={21} />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Announcements</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {announcements.map((notice) => (
                <div key={notice.title} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                  <p className="font-bold text-slate-900 dark:text-white">{notice.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {notice.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-teal-900 py-16 text-white dark:bg-slate-900">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow text-teal-200">Member platform</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Member dashboards, admin controls, notifications, and support workflows are ready.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[460px]">
            {[
              { icon: Users, label: 'Members' },
              { icon: CalendarDays, label: 'Events' },
              { icon: HeartHandshake, label: 'Support' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-lg bg-white/10 p-5 text-center backdrop-blur">
                <Icon className="mx-auto" size={24} />
                <p className="mt-3 text-sm font-black">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
