"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
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
  Star,
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
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
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

interface DashboardSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ mobile, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { role, isLoading } = useCurrentUser();

  const links = role === "admin" ? adminLinks : role === "manager" ? managerLinks : agentLinks;

  return (
    <aside className={cn("flex flex-col border-r border-border bg-surface", mobile ? "w-full" : "hidden w-64 shrink-0 lg:flex")}>
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          PropLead
        </Link>
        {!isLoading && role && (
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand uppercase tracking-wider">
            {roleLabels[role] || role}
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-brand/10 text-brand font-medium"
                  : "text-muted hover:bg-neutral-100 dark:hover:bg-surface-alt hover:text-foreground",
              )}
            >
              <link.icon className={cn("h-4 w-4 shrink-0", isActive && "text-brand")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
