export default function MetricCard({ icon: Icon, label, value, tone = 'teal' }) {
  const toneClasses = {
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200'
  };

  return (
    <div className="surface-card">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${toneClasses[tone]}`}>
            <Icon size={22} />
          </div>
        )}
        <div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
