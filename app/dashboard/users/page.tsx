"use client";

import { useState } from "react";
import { Shield, MoreHorizontal, Check, X } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const sampleUsers = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@agency.com", role: "agent", agency: "Sterling Realty", joined: "Jan 2026", active: true },
  { id: "2", name: "James Chen", email: "james@agency.com", role: "manager", agency: "Sterling Realty", joined: "Feb 2026", active: true },
  { id: "3", name: "Emily Rodriguez", email: "emily@agency.com", role: "agent", agency: "Sterling Realty", joined: "Mar 2026", active: true },
  { id: "4", name: "Admin User", email: "admin@proplead.ai", role: "admin", agency: "PropLead", joined: "Jan 2026", active: true },
  { id: "5", name: "Michael Park", email: "michael@agency.com", role: "agent", agency: "Sterling Realty", joined: "Apr 2026", active: false },
];

const roles = ["agent", "manager", "admin"];

export default function UsersPage() {
  const [users, setUsers] = useState(sampleUsers);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setEditingRole(null);
  };

  const toggleActive = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted">Manage users, roles, and account status</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Shield} />
        <StatCard title="Active" value={users.filter((u) => u.active).length} icon={Check} />
        <StatCard title="Inactive" value={users.filter((u) => !u.active).length} icon={X} />
        <StatCard title="Admins" value={users.filter((u) => u.role === "admin").length} icon={Shield} />
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Agency</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-[#1E293B]/50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted">{user.email}</td>
                  <td className="p-4">
                    {editingRole === user.id ? (
                      <div className="flex items-center gap-1">
                        <select
                          defaultValue={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded border border-border bg-background px-2 py-1 text-xs outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button onClick={() => setEditingRole(null)} className="text-xs text-muted hover:text-foreground">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin" ? "bg-danger/10 text-danger" :
                          user.role === "manager" ? "bg-warning/10 text-warning" :
                          "bg-brand/10 text-brand"
                        }`}>
                          {user.role}
                        </span>
                        <button onClick={() => setEditingRole(user.id)} className="text-xs text-muted hover:text-brand">Change</button>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-muted">{user.agency}</td>
                  <td className="p-4 text-muted">{user.joined}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.active
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
