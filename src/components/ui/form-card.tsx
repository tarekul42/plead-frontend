import type { ReactNode } from "react";

interface FormCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, children, className = "" }: FormCardProps) {
  return (
    <div className={`rounded-card border border-border bg-surface p-6 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      <div className="space-y-5">{children}</div>
    </div>
  );
}

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

export function FormGrid({ children, className = "" }: FormSectionProps) {
  return <div className={`grid gap-5 sm:grid-cols-2 ${className}`}>{children}</div>;
}
