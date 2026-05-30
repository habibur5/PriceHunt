export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="text-lg font-semibold text-slate-950">PriceHunt</div>
        <nav className="text-sm text-slate-600">Search, compare, track, alert</nav>
      </div>
    </header>
  );
}
