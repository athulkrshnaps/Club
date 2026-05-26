export default function PageShell({ eyebrow, title, description, children }) {
  return (
    <main className="bg-slate-50 pt-24 dark:bg-slate-950">
      <section className="container-shell pb-8 pt-8">
        <div className="rounded-lg bg-community-mesh p-6 shadow-soft dark:bg-dark-mesh sm:p-8">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          )}
        </div>
      </section>
      {children}
    </main>
  );
}
