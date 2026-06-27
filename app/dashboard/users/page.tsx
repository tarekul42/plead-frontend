"use client";

import { useState } from "react";
import { Shield, Check, X, MoreHorizontal, Loader2 } from "lucide-react";
import { useUsers } from "@/lib/queries/use-users";
import { adminApi } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/common/empty-state";

const roles = ["agent", "manager", "admin"];

export default function UsersPage() {
  const { data: usersData, isLoading } = useUsers();
  const qc = useQueryClient();
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const users = usersData?.data || [];

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleRoleChange = (_userId: string, _newRole: string) => {
    setEditingRole(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted">Manage users, roles, and account status</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Shield} />
        <StatCard title="Active" value={users.filter((u) => u.isActive).length} icon={Check} />
        <StatCard title="Inactive" value={users.filter((u) => !u.isActive).length} icon={X} />
        <StatCard title="Admins" value={users.filter((u) => u.role === "admin").length} icon={Shield} />
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12">
            <EmptyState title="No users found" message="There are no users in your agency yet." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4">
                      {editingRole === user._id ? (
                        <div className="flex items-center gap-1">
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
                          <button onClick={() => setEditingRole(user._id)} className="text-xs text-muted hover:text-brand">Change</button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleMutation.mutate(user._id)}
                        disabled={toggleMutation.isPending}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {toggleMutation.isPending ? "..." : user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "-"}</td>
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
        )}
      </div>
    </div>
  );
}
