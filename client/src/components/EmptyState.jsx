import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing found', message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-white/15 dark:bg-slate-900/70">
      <SearchX className="mx-auto text-slate-400" size={34} />
      <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
      {message && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );
}
