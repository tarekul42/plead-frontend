import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  errorCode?: string;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  errorCode,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10">
        <AlertTriangle className="h-7 w-7 text-danger" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Error</h3>
      <p className="mb-2 max-w-md text-sm text-muted">{message}</p>
      {errorCode && (
        <p className="mb-4 text-xs text-muted">Error code: {errorCode}</p>
      )}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
