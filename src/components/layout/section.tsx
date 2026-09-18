interface SectionProps {
  children: React.ReactNode;
  variant?: "default" | "surface" | "brand";
  className?: string;
}

export function Section({ children, variant = "default", className = "" }: SectionProps) {
  const bg = {
    default: "bg-background",
    surface: "bg-surface",
    brand: "bg-brand/5",
  }[variant];

  return (
    <section className={`${bg} py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-container mx-auto">{children}</div>
    </section>
  );
}
