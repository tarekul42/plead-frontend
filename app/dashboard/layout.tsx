export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-surface p-6 lg:block">
        <div className="mb-8 text-xl font-bold">PropLead</div>
        <nav className="flex flex-col gap-2 text-sm text-muted">
          <a href="/dashboard" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1E293B]">
            Overview
          </a>
          <a href="/dashboard/leads" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1E293B]">
            Leads
          </a>
          <a href="/dashboard/properties" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1E293B]">
            Properties
          </a>
          <a href="/dashboard/ai-tools" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1E293B]">
            AI Tools
          </a>
          <a href="/dashboard/profile" className="rounded-lg px-3 py-2 transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1E293B]">
            Profile
          </a>
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
