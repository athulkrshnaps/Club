import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureCard({ card }) {
  return (
    <Link
      to={card.path}
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-slate-900"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={card.image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-tr ${card.accent} opacity-35`} />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{card.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
          Open section <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
