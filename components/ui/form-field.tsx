import { type FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, htmlFor, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger">{error.message}</p>
      )}
    </div>
  );
}
