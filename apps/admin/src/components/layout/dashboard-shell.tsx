import { Sidebar } from './sidebar';

export function DashboardShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
