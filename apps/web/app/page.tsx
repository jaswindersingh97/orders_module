export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-300">
          Starter stack
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-white">
          Next, Bun, Hono, Drizzle, Postgres, and TypeScript.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
          The frontend is using Next file-based routes from the `app`
          directory. The backend is ready for Bun, and shared contracts can live
          in the workspace packages.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/dashboard"
            className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
          >
            Open dashboard
          </a>
          <a
            href="http://localhost:4000/health"
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
          >
            API health
          </a>
        </div>
      </section>
    </main>
  );
}
