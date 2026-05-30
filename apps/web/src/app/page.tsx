import { PublicShell } from '@/components/layout/public-shell';

export default function HomePage() {
  return (
    <PublicShell>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
          Bangladesh electronics price comparison
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          Find the best electronics prices across Bangladesh stores.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          Public search, product comparison, price history, alerts, and SEO-friendly category
          pages are scaffolded for the full production platform.
        </p>
      </section>
      </main>
    </PublicShell>
  );
}
