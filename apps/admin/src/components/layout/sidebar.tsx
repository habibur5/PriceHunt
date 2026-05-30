const navigation = [
  'Dashboard',
  'Products',
  'Merges',
  'Brands',
  'Categories',
  'Stores',
  'Scrapers',
  'Alerts',
  'Users',
  'Audit Logs',
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950 p-6">
      <div className="mb-8 text-lg font-semibold text-white">PriceHunt Admin</div>
      <nav className="space-y-2 text-sm text-slate-300">
        {navigation.map((item) => (
          <div key={item} className="rounded-lg px-3 py-2 hover:bg-slate-900">
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
