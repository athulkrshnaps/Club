import { BookOpen, Facebook, HeartHandshake, Instagram, Mail, MapPin, Phone, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Sports & Events', path: '/sports-events', icon: Trophy },
  { label: 'Charity Support', path: '/charity-medical', icon: HeartHandshake }
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black uppercase leading-tight text-slate-950 dark:text-white">
            NAVODHAYAM VAYANASHALA AMARAKUNI
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A local community organization connecting reading, sports, charity, and medical support
            through a trusted member platform.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://facebook.com"
              className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-teal-100 hover:text-teal-700 dark:bg-white/10 dark:text-slate-200"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-rose-100 hover:text-rose-700 dark:bg-white/10 dark:text-slate-200"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-black text-slate-950 dark:text-white">Sections</h3>
          <div className="mt-4 grid gap-3">
            {links.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 text-sm font-semibold text-slate-600 transition hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300"
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black text-slate-950 dark:text-white">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-3">
              <MapPin size={17} /> Amarakuni, Kerala
            </p>
            <p className="flex items-center gap-3">
              <Phone size={17} /> +91 98765 43210
            </p>
            <p className="flex items-center gap-3">
              <Mail size={17} /> navodhayam@example.org
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-500">
        © 2026 NAVODHAYAM VAYANASHALA AMARAKUNI
      </div>
    </footer>
  );
}
