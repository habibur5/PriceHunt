import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function AdminHomePage() {
  return (
    <DashboardShell>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
        <p className="max-w-2xl text-slate-300">
          Product management, store controls, scraper operations, alert monitoring, and role-based
          permissions are scaffolded here.
        </p>
      </section>
    </DashboardShell>
  );
}
