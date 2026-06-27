"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  LayoutDashboard,
  Users,
  Building2,
  Sparkles,
  UserCircle,
  BarChart3,
  Shield,
  MessageSquare,
  FileText,
} from "lucide-react";

const agentLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "My Leads", icon: Users },
  { href: "/dashboard/properties", label: "My Properties", icon: Building2 },
  { href: "/dashboard/interactions", label: "Interactions", icon: MessageSquare },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

const managerLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/ai-usage", label: "AI Usage", icon: BarChart3 },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

const adminLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/users", label: "Users", icon: Shield },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/ai-usage", label: "AI Usage", icon: BarChart3 },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

const roleLabels: Record<string, string> = {
  agent: "Agent",
  manager: "Manager",
  admin: "Admin",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { role, isLoading } = useCurrentUser();

  const links = role === "admin" ? adminLinks : role === "manager" ? managerLinks : agentLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          PropLead
        </Link>
        {!isLoading && role && (
          <span className="rounded-full bg-brand/5 px-2 py-0.5 text-xs text-brand">
            {roleLabels[role] || role}
          </span>
        )}
      </div>
      <nav className="space-y-1 p-6">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-brand/5 text-brand font-medium"
                  : "text-muted hover:bg-neutral-100 dark:hover:bg-surface hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
