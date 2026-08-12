const metrics = [
  { label: "Frontend", value: "Next.js" },
  { label: "Runtime", value: "Bun" },
  { label: "API", value: "Hono" },
  { label: "Database", value: "Postgres" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div>
            <p className="text-sm font-medium text-cyan-300">Dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-white">
              Project command center
            </h1>
          </div>
          <a
            href="/"
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
          >
            Home
          </a>
        </header>

        <div className="grid flex-1 content-start gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-md border border-zinc-800 bg-zinc-900/80 p-4"
            >
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <p className="mt-3 text-xl font-semibold text-white">
                {metric.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
