interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-muted max-w-2xl mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
