const tones = {
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
};

export default function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-pill ${tones[tone]}`}>{children}</span>;
}
