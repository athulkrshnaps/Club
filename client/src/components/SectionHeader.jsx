const alignClasses = {
  left: 'text-left',
  center: 'mx-auto text-center'
};

export default function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`max-w-3xl ${alignClasses[align]}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      )}
    </div>
  );
}
